const fs = require('fs');
const path = require('path');

const { Logger } = require('../core');

const env = require('../config/environment');

const routes = [];

function registerRoutes(app, middleware, folderPath) {

    Logger.log('Initialize routes registration');

    const routesPath = path.join(__dirname, '../../src/routes/' + folderPath);

    getRoutes(routesPath);

    routes.forEach((route) => {

        let url = (env.BASE_URL == '/' ? '' : env.BASE_URL) + path.parse(route.split('routes')[1]).dir.replace(/\\/g, '/');

        Logger.log(`Route registered => URL: [${url}], PATH: [${route}]`);

        app.use(url, middleware, require(route));

    });

    Logger.log('Routes registration complete');
}

function getRoutes(directoryPath) {
    fs.readdirSync(directoryPath).forEach(file => {

        let fullPath = path.join(directoryPath, file);

        if (fs.statSync(fullPath).isDirectory()) {
            getRoutes(fullPath);
        } else if (fullPath.endsWith('.controller.js') && path.extname(fullPath) == '.js') {
            routes.push(fullPath);
        }

    });
}

module.exports = registerRoutes;