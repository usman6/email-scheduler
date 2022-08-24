const Joi = require('@hapi/joi');
const { Op } = require('sequelize');

class RestQueryBuilder {

    validate(obj) {

        let schema = Joi.object({
            query: Joi.array().items(Joi.object({
                action: Joi.string().max(25).required().trim(),
                name: Joi.string().max(255).required().trim(),
                value: Joi.alternatives().try(Joi.string().max(255).trim(), Joi.number(), Joi.boolean()).required()
            })),
            pageNo: Joi.number().integer().min(1).allow(null),
            pageSize: Joi.number().integer().min(1).allow(null),
        });

        return schema.validate(obj);
    }

    mapQuery(query) {

        let clause = {};

        query.forEach((q) => {

            switch (q.action) {
                case '$like':
                    clause[q.name] = { [Op.like]: `%${q.value}%` };
                    break;
                case '$eq':
                    clause[q.name] = { [Op.eq]: q.value };
                    break;
                case '$ne':
                    clause[q.name] = { [Op.ne]: q.value };
                    break;
                case '$lt':
                    clause[q.name] = { [Op.lt]: q.value };
                    break;
                case '$lte':
                    clause[q.name] = { [Op.lte]: q.value };
                    break;
                case '$gt':
                    clause[q.name] = { [Op.gt]: q.value };
                    break;
                case '$gte':
                    clause[q.name] = { [Op.gte]: q.value };
                    break;
                case '$startsWith':
                    clause[q.name] = { [Op.startsWith]: `${q.value}%` };
                    break;
                case '$endsWith':
                    clause[q.name] = { [Op.endsWith]: `%${q.value}` };
                    break;
            }

        });

        return clause;
    }


    build(obj) {

        let { error, value } = this.validate(obj);

        if (error) {
            return {
                error: error,
                value: null
            };
        }

        let result = {
            query: this.mapQuery(value.query),
            pageNo: Math.abs(value.pageNo),
            pageSize: Math.abs(value.pageSize)
        };

        return {
            error: null,
            value: result
        };
    }
}

module.exports = RestQueryBuilder;