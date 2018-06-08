"use strict";

const express = require('express');

const LogRepository = require('../../repositories/logRepository');

let sessionRouter = express.Router();

sessionRouter.get('/session', (req, res, next) => {
    LogRepository.getAllSessions().then(
        (val) => {
            return res.status(val.code).send(val.value);
        },
        (reason) => {
            return res.status(reason.code).send(reason.value);
        });
});

module.exports = sessionRouter;
