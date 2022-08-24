const { Op, Sequelize } = require('sequelize');

const BaseRepository = require('./base.repository');

const { User, Email } = require('../models');

class UserRepository extends BaseRepository {

    constructor() {
        super(User);
    }

    async findAllNoPagination(query) {

        if (!query) {
            query = {};
        }


        let result = await this.model.findAll({
            where: query
        });

        return this.getDataValues(result);
    }

    async findAllUsersWithSentEmails(){
        let result = await this.model.findAll({
            where:{},
            include: [{
            model: Email,
            as: 'sentEmails',
            through:{attributes: []},
            attributes:['id']
           }]});
        return this.getDataValues(result);
    }

    async isUniqueByEmail(email, id = null) {

        if (id) {

            let result = await this.model.count({
                where: {
                    email: email,
                    id: {
                        [Op.ne]: id
                    }
                }
            });

            return result < 1;

        } else {

            let result = await this.model.count({
                where: {
                    email: email
                }
            });

            return result < 1;
        }

    }

}

module.exports = UserRepository;