"use strict";

const Promise = require('promise');
const _ = require('lodash');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const logsTable = "logs";
const timestamp = "timestamp";
const fs = require("fs");
const moment = require("moment");

function createDatabase(fileName) {
    console.log("fileName: " + fileName);
    let adapter = new FileSync('db/' + fileName);
    return low(adapter);
}

let HistoryRepository = {
    listDatabases: () => {
        return new Promise((resolve, reject) => {
            fs.readdir('db', (err, files) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(files);
                }
            });
        });
    },

    getLogs: (fileName, sessionName) => {
        return new Promise((resolve, reject) => {
            try {
                let db = createDatabase(fileName);
                let logs = db.get(logsTable)
                    .filter(function (log) {
                        if (sessionName && sessionName !== log.sessionName) {
                            return false
                        }
                        return true;
                    })
                    .sortBy(timestamp)
                    .value();
                resolve(logs);
            } catch (e) {
                reject(e);
            }
        });
    },
    getAsString: (fileName, sessionName) => {
        return new Promise((resolve, reject) => {
            try {
                let db = createDatabase(fileName);
                let logs = db.get(logsTable)
                    .filter(function (log) {
                        return !(sessionName && sessionName !== log.sessionName);
                    })
                    .sortBy(timestamp)
                    .value();
                let text = '';
                _.each(logs, function (log) {
                    if (log.timestamp) {
                        text += new Date(log.timestamp).toISOString().replace(/T/, ' ').replace(/\..+/, '');
                        text += ":  ";
                        text += log.severity;
                        text += ":  ";
                        text += log.message;
                        text += "\n";
                    }
                });
                resolve(text);
            } catch (e) {
                reject(e);
            }
        });
    },
    delete: (fileName) => {
        return new Promise((resolve, reject) => {
            try {
                const filePath = 'db/' + fileName;
                fs.unlinkSync(filePath);
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    },
    getAllSessions: (fileName) => {
        return new Promise((resolve, reject) => {
            try {
                let db = createDatabase(fileName);
                let logs = db.get(logsTable)
                    .map('sessionName')
                    .uniq()
                    .value();
                console.log(logs);
                resolve(logs);
            } catch (e) {
                reject(e);
            }
        });
    }
};

module.exports = HistoryRepository;