const Joi = require('@hapi/joi');
const {
    EmailRepository
} = require('../../../../common/repository');

const {
    RestQueryBuilder,
    BadInputError,
    UnauthorizedError,
    ResourceNotFoundError,
    ResourceAlreadyExistsError } = require('../../../../core');

class EmailService {

    constructor() {
        this.restQueryBuilder = new RestQueryBuilder();
        this.emailRepository = new EmailRepository();
    }

    async findAllEmails() {

        let result = await this.emailRepository.findAllEmails();

        return result;
    }

}

module.exports = EmailService;