const Joi = require('@hapi/joi');

const {
    UserRepository
} = require('../../../../common/repository');

const {
    RestQueryBuilder,
    BadInputError,
    UnauthorizedError,
    ResourceNotFoundError,
    ResourceAlreadyExistsError } = require('../../../../core');

class UserService {

    constructor() {
        this.restQueryBuilder = new RestQueryBuilder();
        this.userRepository = new UserRepository();
    }

    async findAllUsersSentEmails(){
        let result = await this.userRepository.findAllUsersWithSentEmails();
        return result;
    }

    async findAll({ pageNo, pageSize }) {


        let users = await this.userRepository.findAll({
            pageNo: pageNo,
            pageSize: pageSize
        });

        return users;
    }

    async findById(id) {
        let user = await this.userRepository.findById(id);

        if (!user) {
            throw new ResourceNotFoundError(`[id:${id}] does not exist`);
        }

        return user;
    }

    async findAllByQuery(query) {

        let { error, value } = this.restQueryBuilder.build(query);

        if (error) {
            throw new BadInputError(null, error);
        }

        let users = await this.userRepository.findAll(value);

        return users;
    }

    async findAllByQueryNoLimit(query) {

        let { error, value } = this.restQueryBuilder.build(query);

        if (error) {
            throw new BadInputError(null, error);
        }

        let users = await this.userRepository.findAllNoPagination(value.query);

        return users;
    }

    async create(user) {
        let { error, value } = validateUser(user);

        if (error) {
            throw new BadInputError(null, error);
        }

        let isUniqueByEmail = await this.userRepository.isUniqueByEmail(value.email);

        if (!isUniqueByEmail) {
            throw new ResourceAlreadyExistsError(`[email:${value.email}] already exists`);
        }

        let result = await this.userRepository.create(value);

        return result;
    }

    async update(id, user) {
        let { error, value } = validateUser(user);

        if (error) {
            throw new BadInputError(null, error);
        }

        let result = await this.userRepository.findById(id);

        if (!result) {
            throw new ResourceNotFoundError(`[id:${id}] does not exist`);
        }

        let isUniqueByEmail = await this.userRepository.isUniqueByEmail(value.email, id);

        if (!isUniqueByEmail) {
            throw new ResourceAlreadyExistsError(`[email:${value.email}] already exists`);
        }

        let updatedUser = await this.userRepository.update(result.id, value);

        return updatedUser;
    }

    async delete(id) {
        let user = await this.userRepository.findById(id);

        if (!user) {
            throw new ResourceNotFoundError(`[id:${id}] does not exist`);
        }


        let deletedUser = await this.userRepository.delete(id);

        return deletedUser;
    }

}

function validateUser(email) {
    let schema = Joi.object({
        fullName: Joi.string().trim().max(255).required(),
        email: Joi.string().email().required()
    });

    return schema.validate(email);
}



module.exports = UserService;