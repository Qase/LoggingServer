"use strict";

const openLoggingApi = require('../api/v1/logs');
const openSessionsApi = require('../api/v1/sessions');
const openLoggingWS = require('../api/v1/logsWS');

let Router = (app) => {
    app.use('/api/v1/', openLoggingApi);
    app.use('/api/v1/', openSessionsApi);
};

module.exports = Router;
