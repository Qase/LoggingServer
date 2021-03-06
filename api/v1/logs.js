"use strict";

const express = require('express');
const LogValidator = require('../../validators/logValidator');
const DbRepository = require('../../repositories/dbRepository');
const fs = require('fs');
const common = require('./common');

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
            DbRepository.create(toStore).then(
                (val) => {
                    return res.status(200).send(val);
                },
                (reason) => {
                    return res.status(400).send(reason);
                });

        } catch (e) {
            console.log(e.array());
            res.status(400).send({errors: e.array(), message: 'Input data validation failed.'});
        }
    });
});

logRouter.get('/log', (req, res, next) => {
    let lastUpdated = common.extractQueryParam(req, 'lastUpdated');
    let sessionName = common.extractQueryParam(req, 'sessionName');
    common.resolveGet(DbRepository.getLogs(isNaN(lastUpdated) ? null : Number(lastUpdated), sessionName), res);
});

logRouter.get('/log/download', function (req, res) {
    DbRepository.getAsString(common.extractQueryParam(req, 'sessionName')).then((val) => {
            let file = 'log.txt';
            fs.writeFile(file, val, function (err) {
                if (err) throw err;
                res.download(file); // Set disposition and send it.
            });
        },
        (reason) => {
            return res.status(400).send(reason);
        });


});

logRouter.delete('/log', (req, res, next) => {
    DbRepository.delete(common.extractQueryParam(req, 'sessionName')).then(
        (val) => {
            return res.status(204).send(val);
        },
        (reason) => {
            return res.status(400).send(reason);
        }
    );
});

module.exports = logRouter;
