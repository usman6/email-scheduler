const axios = require('axios');
const cron = require('node-cron');
const { Logger } = require('./core');
const lodash = require('lodash');
const { KafkaClient, Producer } = require('kafka-node');

const {
    KAFKA_CLUSTER,
    API_URL,
    KAFKA_EMAIL_TOPIC
 } = require('./config/environment');

const HEALTH_URL = API_URL + '/status/health';

axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';

getServicesHealth();

const kClient = new KafkaClient({ kafkaHost: KAFKA_CLUSTER });
const producer = new Producer(kClient);

producer.on('error', (err) => {
    Logger.error(`[Kafka:${err.message}]`);
    process.exit(1);
});

async function produceEmails(){
        Logger.log('scheduling emails....')
        let usersEmails = await getAllUserEmails();
        let emails = await getAllEmails();
        let newUsersEmails = [];
        let emailsKeys = Object.keys(emails).map((k)=> parseInt(k));
        if(!usersEmails || usersEmails.length < 1) return;
        Object.keys(usersEmails).map((userEmailKey)=>{
            let diffArr = lodash.difference(emailsKeys, usersEmails[userEmailKey]['sentEmails']);
            if(!diffArr || diffArr.length < 1) return;
            let randomlySelectedEmail = diffArr[Math.floor(Math.random() * diffArr.length)];
            newUsersEmails.push({
                userId:usersEmails[userEmailKey].id,
                emailId:randomlySelectedEmail
            })
            sendToEmailTopic({emailSubject: emails[randomlySelectedEmail].subject,
            emailBody:emails[randomlySelectedEmail].body,
            recipient:userEmailKey
        })
        });
        if (!newUsersEmails || newUsersEmails.length < 1) return;
        await updateUserEmails(newUsersEmails);

}

async function getAllEmails() {
    try {
        const response = await axios.get(API_URL + '/api/v1/email');
        let emails = {};
        response.data.map((email)=>emails[email.id]=email);
        return emails;
    }
    catch (e) {
        Logger.error(e);
    }
}

async function getAllUserEmails() {
    try {
        const response = await axios.get(API_URL + '/api/v1/user/sent/emails');
        let result = {}
        response.data.map((user) => result[user.email] =
        {
            id:user.id,
            sentEmails: user.sentEmails.map(email => email.id)
        });
        return result;
    }
    catch (e) {
        Logger.error(e);
    }
}

async function updateUserEmails(data) {
    try {
        await axios.post(API_URL + '/api/v1/user-email', data);
    }
    catch (e) {
        Logger.error(e);
    }
}


async function getServicesHealth() {
    try {
        const res = await axios.get(HEALTH_URL);
        if (res.status == 200) {
            Logger.log('Services Available...');
        }
        else {
            Logger.error('Services Not Available...')
        }
    }
    catch (e) {
        Logger.error('Services Not Available...')
    }
}

async function sendToEmailTopic(email) {
    email['publishTime'] = new Date().toISOString();
    let emailStr = JSON.stringify(email);
    Logger.log('publishing to topic...');
    Logger.log(emailStr);
    producer.send([{ 'topic': KAFKA_EMAIL_TOPIC, messages: emailStr }], function (err, data) {
        if (err){Logger.error(err)};
    });
}

cron.schedule('* * * * *', async  () => {
       await produceEmails();
});
