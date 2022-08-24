const env = require('./default.json');

module.exports = {
    NODE_ENV: process.env.NODE_ENV || env['nodeEnv'],


    KAFKA_CLUSTER: process.env.KAFKA_CLUSTER || env['kafkaCluster'],
    KAFKA_GROUP_ID: process.env.GROUP_ID || env['kafkaGroupId'],
    KAFKA_EMAIL_TOPIC: process.env.KAFKA_EMAIL_TOPIC || env['kafkaEmailTopic'],

    FROM_EMAIL: process.env.FROM_EMAIL || env["fromEmail"],
    SG_KEY: process.env.SG_KEY || env["sgKey"],

    EMAIL_RETRY_COUNT: process.env.EMAIL_RETRY_COUNT || env["emailRetryCount"]

};