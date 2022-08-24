const BaseRepository = require('./base.repository');

const { UserSentEmail } = require('../models');

class UserSentEmailRepository extends BaseRepository {

    constructor() {
        super(UserSentEmail);
    }
    async bulkCreate(userSentEmails){
        let result = await this.model.bulkCreate(userSentEmails);
        return this.getDataValues(result)
    }
}

module.exports = UserSentEmailRepository;