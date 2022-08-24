const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const {
  authMiddleware,
} = require('./common/middleware');

const swaggerDocument = YAML.load(path.join(__dirname + '/../scripts/email-manager-swagger-docs.yaml'));

const app = express();

require('./startup/bootstrap')(app);
app.use('/v1/api-docs', authMiddleware, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
require('./startup/register-controllers')(app, authMiddleware, 'api/v1');
require('./startup/register-controllers')(app, authMiddleware, 'status');
require('./startup/register-handlers')(app);

module.exports = app;