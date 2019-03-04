"use strict";

const express = require('express');

const DBRepository = require('../../repositories/dbRepository');

let sessionRouter = express.Router();

sessionRouter.get('/session', (req, res, next) => {
    DBRepository.getAllSessions().then(
        (val) => {
            return res.status(200).send(val);
        },
        (reason) => {
            return res.status(400).send(reason);
        });
});

module.exports = sessionRouter;
