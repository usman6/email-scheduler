
const publicEndpoints = [
    '/status',
    '/status/health',
    '/v1/api-docs'
];

module.exports = async (req, res, next) => {

    try {
        if (publicEndpoints.includes(req.originalUrl)) {
            return next();
        }

        return next();

    } catch(err) {
        return next(err);
    }

};