"use strict";

const express = require('express');
const LogValidator = require('../../validators/logValidator');
const LogRepository = require('../../repositories/logRepository');
const fs = require('fs');

let logRouter = express.Router();

logRouter.post('/log', (req, res, next) => {
    LogValidator.validate(req, (result) => {
        try {
            result.throw();

            let toStore = [];
            for (let i = 0; i < req.body.length; i++) {

                var singleLog = req.body[i];

                let logObject = {
                    sessionName: singleLog.sessionName,
                    timestamp: singleLog.timestamp,
                    message: singleLog.message,
                    severity: singleLog.severity,
                };

                toStore.push(logObject);
            }

            LogRepository.create(toStore).then(
                (val) => {
                    return res.status(val.code).send(val.value);
                },
                (reason) => {
                    return res.status(reason.code).send(reason.value);
                });

        } catch (e) {
            console.log(e.array());
            res.status(400).send({errors: e.array(), message: 'Input data validation failed.'});
        }
    });
});

logRouter.get('/log', (req, res, next) => {
    var lastUpdated;
    if (req.query.hasOwnProperty('lastUpdated')) {
        lastUpdated = req.query.lastUpdated;
        if (isNaN(lastUpdated)) {
            lastUpdated = null;
        }
    } else {
        lastUpdated = null;
    }

    var promise;
    if (req.query.hasOwnProperty('sessionName')) {
        promise = LogRepository.getBySessionName(req.query.sessionName, lastUpdated);
    } else {
        promise = LogRepository.getAll(lastUpdated);
    }
    promise.then(
        (val) => {
            return res.status(val.code).send(val.value);
        },
        (reason) => {
            return res.status(reason.code).send(reason.value);
        });
});

logRouter.get('/log/download', function (req, res) {
    let text;
    if (req.query.hasOwnProperty('sessionName')) {
        text = LogRepository.getBySessionNameAsString(req.query.sessionName)
    } else {
        text = LogRepository.getAllAsString()
    }
    let file = __dirname + '/log.txt';
    fs.writeFile(file, text, function (err) {
        if (err) throw err;
        res.download(file); // Set disposition and send it.
    });
});

logRouter.delete('/log', (req, res, next) => {
    var promise;
    if (req.query.hasOwnProperty('sessionName')) {
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
