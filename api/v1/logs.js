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
                sessionName: req.body.sessionName,
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
    var promise;
    if(req.query.hasOwnProperty('sessionName')) {
        promise = LogRepository.getBySessionName(req.query.sessionName);
    } else {
        promise = LogRepository.getAll();
    }
    promise.then(
        (val) => {
            return res.status(val.code).send(val.value);
        },
        (reason) => {
            return res.status(reason.code).send(reason.value);
        });
});

logRouter.get('/log/sessions', (req, res, next) => {
    LogRepository.getAllSessions().then(
        (val) => {
            return res.status(val.code).send(val.value);
        },
        (reason) => {
            return res.status(reason.code).send(reason.value);
        });
});

logRouter.delete('/log', (req, res, next) => {
    var promise;
    if(req.query.hasOwnProperty('sessionName')) {
        promise = LogRepository.deleteBySessionName(req.query.sessionName);
    } else {
        promise = LogRepository.deleteAll();
    }
    promise.then(
        (val) => {
            return res.status(val.code).send(val.value);
        },
        (reason) => {
            return res.status(reason.code).send(reason.value);
        });
});

module.exports = logRouter;
