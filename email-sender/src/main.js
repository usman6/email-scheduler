const { ConsumerGroup, KafkaClient, Producer, Offset } = require('kafka-node');
const { Logger } = require('./core');
const sgMail = require('@sendgrid/mail');

const {
    KAFKA_CLUSTER,
    KAFKA_GROUP_ID,
    KAFKA_EMAIL_TOPIC,
    FROM_EMAIL,
    EMAIL_RETRY_COUNT,
    SG_KEY
     } = require('./config/environment');

var Mutex = function () {
    this.queue = [];
    this.locked = false;
};

Mutex.prototype.enqueue = function (task) {
    this.queue.push(task);
    if (!this.locked) {
        this.dequeue();
    }
};

Mutex.prototype.dequeue = function () {
    this.locked = true;
    const task = this.queue.shift();
    if (task) {
        this.execute(task);
    } else {
        this.locked = false;
    }
};

Mutex.prototype.execute = async function (task) {
    try { await task(); } catch (err) { }
    this.dequeue();
}

function options() {

    let opt = {
        kafkaHost: KAFKA_CLUSTER,
        groupId: KAFKA_GROUP_ID,
        sessionTimeout: 15000,
        autoCommit: true,
        autoCommitIntervalMs: 5000,
        protocol: ['roundrobin'],
        fromOffset: 'latest'
    };
    return opt;
}

const kClient = new KafkaClient({ kafkaHost: KAFKA_CLUSTER });
const consumerGroup = new ConsumerGroup(options(), KAFKA_EMAIL_TOPIC);
const producer = new Producer(kClient);
sgMail.setApiKey(SG_KEY);

const offset = new Offset(kClient);

offset.fetchLatestOffsets([KAFKA_EMAIL_TOPIC], (err, offsets) => {
    if (err) {
        Logger.log(`error fetching latest offsets ${err}`)
        return
    }
    let latest = 1
    Object.keys(offsets[KAFKA_EMAIL_TOPIC]).forEach( o => {
        latest = offsets[KAFKA_EMAIL_TOPIC][o] > latest ? offsets[KAFKA_EMAIL_TOPIC][o] : latest
    })
    consumerGroup.setOffset(KAFKA_EMAIL_TOPIC, 0, latest-1)
})

consumerGroup.on('error', (err) => {
    Logger.error(`[Kafka:${err.message}]`);
    process.exit(1);
});

consumerGroup.on('connect', (message) => {
    Logger.log(`Kafka:Connected`);
});

producer.on('error', (err) => {
    Logger.error(`[Kafka:${err.message}]`);
    process.exit(1);
});


var mutex = new Mutex();
consumerGroup.on('message', message => mutex.enqueue(function () { return applyMessage(message); }));

async function applyMessage(message) {
    await sendEmail(message.value);
}


async function sendEmail(email) {
    let parsedEmail = {};
    try {
        Logger.log('email sender: sending email....');
        Logger.log(email);
        parsedEmail = JSON.parse(email)
        await sgMail.send({
            to:parsedEmail.recipient,
            from:FROM_EMAIL,
            text:parsedEmail.emailBody,
            subject:parsedEmail.emailSubject
        })
    }
    catch (e) {
         //resend to topic so that it could be sent again.
        Logger.error(email);
        Logger.error(e);
        if(parsedEmail['retryCount'] && parsedEmail['retryCount'] >= EMAIL_RETRY_COUNT) return;
        parsedEmail['retryCount'] ? parsedEmail['retryCount']+=1 : parsedEmail['retryCount'] = 1;
        sendToEmailTopic(JSON.stringify(parsedEmail));
    }
}

async function sendToEmailTopic(email) {
    producer.send([{ 'topic': KAFKA_EMAIL_TOPIC, messages: email }], function (err, data) {
        Logger.error(err);
    });
}
