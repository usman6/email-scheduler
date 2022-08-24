const { Op } = require("sequelize");
class BaseRepository {

    constructor(model) {
        this.model = model;
    }

    async findAll({ pageNo, pageSize, query, order, include }) {

        if (!query) {
            query = {};
        }

        let count = await this.model.count({
            where: query
        });

        let paginate = this.paginate({ pageNo: pageNo, pageSize: pageSize, count: count });

        let result = await this.model.findAll({
            where: query,
            limit: paginate.pageSize,
            offset: paginate.offset,
            order: order,
            include: include
        });

        delete paginate.offset;

        return {
            ...paginate,
            data: this.getDataValues(result)
        };
    }

    async findById(id) {
        let result = await this.model.findOne({
            where: {
                id: id
            }
        });

        return this.getDataValues(result);
    }

    async findByName(name) {
        let result = await this.model.findOne({
            where: {
                name: name
            }
        });

        return this.getDataValues(result);
    }

    async isUniqueByName(name, id = null) {

        if (id) {

            let result = await this.model.count({
                where: {
                    name: name,
                    id: {
                        [Op.ne]: id
                    }
                }
            });

            return result < 1;

        } else {

            let result = await this.model.count({
                where: {
                    name: name
                }
            });

            return result < 1;
        }

    }

    async create(entity) {
        let result = await this.model.create(entity);
        return this.getDataValues(result);
    }

    async update(id, entity) {
        await this.model.update(entity, {
            where: {
                id: id
            }
        });

        let result = await this.model.findOne({
            where: {
                id: id
            }
        });

        return this.getDataValues(result);
    }

    async delete(id) {

        let result = await this.model.findOne({
            where: {
                id: id
            }
        });

        await this.model.destroy({
            where: {
                id: id
            }
        });

        return this.getDataValues(result);
    }

    async count() {
        let result = await this.model.count();
        return result;
    }

    paginate({ pageNo, pageSize, count }) {

        let number = Math.floor(Math.abs(+pageNo)) || 1;
        let size = Math.floor(Math.abs(+pageSize)) || 100;
        let pages = Math.floor((count + size - 1) / size);
        let offset = (number - 1) * size;

        if (size > 100) {
            size = 100;
        }

        return {
            pageNo: number,
            pageSize: size,
            totalElements: count,
            totalPages: pages,
            offset: offset
        };
    }

    getDataValues(result) {
        if (Array.isArray(result)) {
            return result.map(el => el.get({ plain: true }));
        } else {
            return result ? result.get({ plain: true }) : null;
        }
    }
}

module.exports = BaseRepository;