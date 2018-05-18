"use strict";

const Promise = require('promise');

const UUID = require('uuid/v4');
const LogModel = require("../models/logModel").LogModel;

var logsBySessionName = {};

var sorComparator = function(a, b) {
    var x = a.timestamp;
    var y = b.timestamp;
    if (x < y) { return -1; }
    if (x > y) { return 1; }
    return 0;
};

let LogRepository = {
    create: (logObject) => {
        return new Promise((resolve, reject) => {
            let resultLogObject = {
                id: UUID(),
                sessionName: logObject.sessionName,
                timestamp: logObject.timestamp,
                message: logObject.message,
                severity: logObject.severity
            };

            if(!logsBySessionName.hasOwnProperty(resultLogObject.sessionName)) {
                logsBySessionName[resultLogObject.sessionName] = [];
            }

            logsBySessionName[resultLogObject.sessionName].push(resultLogObject);

            return resolve({value: resultLogObject, code: 201});
        });
    },
    getAll: () => {
        return new Promise((resolve, reject) => {
            var result = [];
            for(var sessionName in logsBySessionName) {
                var sessionLogItems = logsBySessionName[sessionName];
                for(var i = 0; i < sessionLogItems.length; i++) {
                    result.push(sessionLogItems[i]);
                }
            }

            result.sort(sorComparator);

            return resolve({value: result, code: 200});
        });
    },
    deleteAll: () => {
        return new Promise((resolve, reject) => {
            logsBySessionName = {};
            return resolve({value: null, code: 200});
        });
    },
    getBySessionName: (sessionName) => {
        return new Promise((resolve, reject) => {
            if(!logsBySessionName.hasOwnProperty(sessionName)) {
                 return reject({value: error, code: 404});
            }

            var sessionLogItems = logsBySessionName[sessionName];
            sessionLogItems.sort(sorComparator);

            return resolve({value: sessionLogItems, code: 200});
        });
    },
    deleteBySessionName: (sessionName) => {
        return new Promise((resolve, reject) => {
            if(!logsBySessionName.hasOwnProperty(sessionName)) {
                return reject({value: error, code: 404});
            }

            logsBySessionName[sessionName] = [];
            delete logsBySessionName[sessionName];

            return resolve({value: null, code: 200});
        });
    },
    getAllSessions: () => {
        return new Promise((resolve, reject) => {
            var result = [];
            for(var sessionName in logsBySessionName) {
                result.push(sessionName);
            }
            return resolve({value: result, code: 200});
        });
    },
};

module.exports = LogRepository;