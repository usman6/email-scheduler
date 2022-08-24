const moment = require('moment');
const colors = require('colors/safe');

class Logger {

    static log(message) {
        console.log(`${colors.green(moment().toString())}: ${colors.cyan('INFO')}: ${message}`);
    }

    static warn(message) {
        console.log(`${colors.green(moment().toString())}: ${colors.yellow('WARN')}: ${message}`);
    }

    static error(message) {
        console.log(`${colors.green(moment().toString())}: ${colors.red('ERROR')}: ${message}`);
    }

    static fatal(message) {
        console.log(`${colors.green(moment().toString())}: ${colors.red('FATAL')}: ${message}`);
    }

    static debug(message) {
        console.log(`${colors.green(moment().toString())}: ${colors.yellow('DEBUG')}: ${message}`);
    }

}

module.exports = Logger;