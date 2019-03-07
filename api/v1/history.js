"use strict";

const express = require('express');
const HistoryRepository = require('../../repositories/historyRepository');
const fs = require('fs');
const common = require('./common');

let historyRouter = express.Router();


historyRouter.get('/logs/history', (req, res, next) => {
    common.resolveGet(HistoryRepository.listDatabases(), res);
});

historyRouter.get('/logs/history/:fileName/sessions', function (req, res) {
    let fileName = common.extractUrlParam(req, 'fileName');
    common.resolveGet(HistoryRepository.getAllSessions(fileName), res)
});
historyRouter.get('/logs/history/:fileName/download', function (req, res) {
    let fileName = common.extractUrlParam(req, 'fileName');
    let sessionName = common.extractQueryParam(req, 'sessionName');
    HistoryRepository.getAsString(fileName, sessionName).then((val) => {
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

historyRouter.get('/logs/history/:fileName', function (req, res) {
    let fileName = common.extractUrlParam(req, 'fileName');
    let sessionName = common.extractQueryParam(req, 'sessionName');
    common.resolveGet(HistoryRepository.getLogs(fileName, sessionName), res)
});

historyRouter.delete('/logs/history/:fileName', (req, res, next) => {
    let fileName = common.extractUrlParam(req, 'fileName');
    HistoryRepository.delete(fileName).then(
        (val) => {
            return res.status(204).send(val);
        },
        (reason) => {
            return res.status(400).send(reason);
        }
    );
});

module.exports = historyRouter;
