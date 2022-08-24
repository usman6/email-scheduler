const Joi = require('@hapi/joi');

const {
    UserSentEmailRepository
} = require('../../../../common/repository');

const {
    BadInputError,
    ResourceNotFoundError,
    ResourceAlreadyExistsError } = require('../../../../core');

class UserEmailService {

    constructor() {
        this.userSentEmailRepository = new UserSentEmailRepository();
    }



    async createAll(userEmails) {
        let { error, value } = validateUserEmails(userEmails);

        if (error) {
            throw new BadInputError(null, error);
        }

        let result = await this.userSentEmailRepository.bulkCreate(value);

        return result;
    }

}

function validateUserEmails(userEmails) {
    let schema = Joi.array().items(Joi.object({
        userId: Joi.number().integer().min(1).required(),
        emailId: Joi.number().integer().min(1).required()
    }));

    return schema.validate(userEmails);
}



module.exports = UserEmailService;