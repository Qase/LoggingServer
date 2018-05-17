"use strict";

const express = require('express');

const LogValidator = require('../../validators/logValidator');
const LogRepository = require('../../repositories/logRepository');


let logRouter = express.Router();

logRouter.post('/log', (req, res, next) => {

    LogValidator.validate(req, (result) => {
        try {
            result.throw();

            let logObject = {
                timestamp: req.body.timestamp,
                message: req.body.message,
                severity: req.body.severity,
            };

            LogRepository.create(logObject).then(
                (val) => {
                    return res.status(val.code).send(val.value);
                },
                (reason) => {
                    return res.status(reason.code).send(reason.value);
                });

        } catch (e) {
            console.log(e.array());
            res.status(400).send({ errors: e.array(), message: 'Input data validation failed.' });
        }
    });
});


logRouter.get('/log', (req, res, next) => {

    LogRepository.getAll().then(
        (val) => {
            return res.status(val.code).send(val.value);
        },
        (reason) => {
            return res.status(reason.code).send(reason.value);
        });
});

module.exports = logRouter;
