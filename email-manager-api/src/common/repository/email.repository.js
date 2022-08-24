const BaseRepository = require('./base.repository');

const { Email } = require('../models');

class EmailRepository extends BaseRepository {

    constructor() {
        super(Email);
    }
    async findAllEmails(){
        let result = await this.model.findAll();
        return this.getDataValues(result)
    }
}

module.exports = EmailRepository;