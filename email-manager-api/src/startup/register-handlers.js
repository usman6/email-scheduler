const { HttpMessage,
    BadInputError,
    UnauthorizedError,
    ResourceNotFoundError,
    ResourceAlreadyExistsError } = require('../core');

function registerErrorHandlers(app) {

    app.use((req, res, next) => {
        return res.status(404).json(HttpMessage.notFound());
    });

    app.use((err, req, res, next) => {

        if (err instanceof(UnauthorizedError)) {
            return res.status(401).json(HttpMessage.unauthorized(err.message));
        }

        if (err instanceof(BadInputError)) {
            return res.status(400).json(HttpMessage.badRequest(processBadInputErrors(err)));
        }
    
        if (err instanceof(ResourceNotFoundError)) {
            return res.status(404).json(HttpMessage.notFound(err.message));
        }
    
        if (err instanceof(ResourceAlreadyExistsError)) {
            return res.status(409).json(HttpMessage.conflict(err.message));
        }
    
        return res.status(500).json(HttpMessage.internalServerError(err.message));
    
    });

}

function processBadInputErrors(error) {

    if (error.originalError && error.originalError.isJoi && error.originalError.details.length > 0) {
        return error.originalError.details[0].message;
    } else if (error.message)  {
        return error.message;
    } else {
        return null;
    }

}

module.exports = registerErrorHandlers;