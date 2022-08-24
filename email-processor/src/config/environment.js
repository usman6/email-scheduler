const env = require('./default.json');

module.exports = {
    NODE_ENV: process.env.NODE_ENV || env['nodeEnv'],

    API_URL: process.env.API_URL || env['apiUrl'],

    KAFKA_CLUSTER: process.env.KAFKA_CLUSTER || env['kafkaCluster'],
    KAFKA_EMAIL_TOPIC: process.env.KAFKA_EMAIL_TOPIC || env['kafkaEmailTopic'],

};