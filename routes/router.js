"use strict";

const openLoggingApi = require('../api/v1/logs');

let Router = (app) => {
    app.use('/api/v1/', openLoggingApi);
};

module.exports = Router;
