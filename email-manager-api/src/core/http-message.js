const moment = require('moment');

class HttpMessage {

    constructor({ status, statusCode, message, timestamp }) {
        this.status = status;
        this.statusCode = statusCode;
        this.message = message;
        this.timestamp = timestamp;
    }

    static ok(message = null) {
        return new HttpMessage({
            status: 'Ok',
            statusCode: 200,
            message: message,
            timestamp: moment()
        });
    }

    static unauthorized(message = null) {
        return new HttpMessage({
            status: 'Unauthorized',
            statusCode: 401,
            message: message,
            timestamp: moment()
        });
    }

    static badRequest(message = null) {
        return new HttpMessage({
            status: 'Bad Request',
            statusCode: 400,
            message: message,
            timestamp: moment()
        });
    }

    static notFound(message = null) {
        return new HttpMessage({
            status: 'Not Found',
            statusCode: 404,
            message: message,
            timestamp: moment()
        });
    }

    static conflict(message = null) {
        return new HttpMessage({
            status: 'Conflict',
            statusCode: 409,
            message: message,
            timestamp: moment()
        });
    }

    static internalServerError(message = null) {
        return new HttpMessage({
            status: 'Internal Server Error',
            statusCode: 500,
            message: message,
            timestamp: moment()
        });
    }

}

module.exports = HttpMessage;