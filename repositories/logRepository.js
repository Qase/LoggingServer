"use strict";

const Promise = require('promise');

const UUID = require('uuid/v4');
const LogModel = require("../models/logModel").LogModel;

let logsBySessionName = {};

const sorComparator = function (a, b) {
    const x = a.timestamp;
    const y = b.timestamp;
    if (x < y) {
        return -1;
    }
    if (x > y) {
        return 1;
    }
    return 0;
};

let LogRepository = {
    create: (logObjects) => {
        return new Promise((resolve, reject) => {
            let resultLogObjects = [];
            for (let i = 0; i < logObjects.length; i++) {
                let logObject = logObjects[i];

                let resultLogObject = {
                    id: UUID(),
                    sessionName: logObject.sessionName,
                    timestamp: logObject.timestamp,
                    message: logObject.message,
                    severity: logObject.severity
                };

                if (!logsBySessionName.hasOwnProperty(resultLogObject.sessionName)) {
                    logsBySessionName[resultLogObject.sessionName] = [];
                }

                logsBySessionName[resultLogObject.sessionName].push(resultLogObject);
                resultLogObjects.push(resultLogObject);
            }
            return resolve({value: resultLogObjects, code: 201});
        });
    },
    getAll: (lastUpdated) => {
        return new Promise((resolve, reject) => {
            let result = [];
            for (const sessionName in logsBySessionName) {
                if(!logsBySessionName.hasOwnProperty(sessionName))continue;
                const sessionLogItems = logsBySessionName[sessionName];
                for (let i = 0; i < sessionLogItems.length; i++) {
                    result.push(sessionLogItems[i]);
                }
            }

            result.sort(sorComparator);
            if (!!lastUpdated) {
                result = result.filter(function (item) {
                    return item.timestamp > lastUpdated;
                });
            }


            return resolve({value: result, code: 200});
        });
    },
    deleteAll: () => {
        return new Promise((resolve, reject) => {
            logsBySessionName = {};
            return resolve({value: null, code: 200});
        });
    },
    getBySessionName: (sessionName, lastUpdated) => {
        return new Promise((resolve, reject) => {
            if (!logsBySessionName.hasOwnProperty(sessionName)) {
                return reject({value: error, code: 404});
            }
            let sessionLogItems = logsBySessionName[sessionName];
            sessionLogItems.sort(sorComparator);
            if (!!lastUpdated) {
                sessionLogItems = sessionLogItems.filter(function (item) {
                    return item.timestamp > lastUpdated;
                });
            }
            return resolve({value: sessionLogItems, code: 200});
        });
    },
    deleteBySessionName: (sessionName) => {
        return new Promise((resolve, reject) => {
            if (!logsBySessionName.hasOwnProperty(sessionName)) {
                return reject({value: error, code: 404});
            }

            logsBySessionName[sessionName] = [];
            delete logsBySessionName[sessionName];

            return resolve({value: null, code: 200});
        });
    },
    getAllSessions: () => {
        return new Promise((resolve, reject) => {
            const result = [];
            for (const sessionName in logsBySessionName) {
                if(!logsBySessionName.hasOwnProperty(sessionName))continue;
                result.push(sessionName);
            }
            return resolve({value: result, code: 200});
        });
    },
};

module.exports = LogRepository;