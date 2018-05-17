"use strict";

const openLoggingApi = require('../api/v1/logs');
const openLoggingWS = require('../api/v1/logsWS');

let Router = (app) => {
    app.use('/api/v1/', openLoggingApi);
};

module.exports = Router;
