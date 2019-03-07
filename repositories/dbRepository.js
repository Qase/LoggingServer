"use strict";

const Promise = require('promise');
const _ = require('lodash');
const shortid = require('shortid');
const LogModel = require("../models/logModel").LogModel;
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
let adapter;
let database;
const logsTable = "logs";
const timestamp = "timestamp";
const fs = require("fs");
const moment = require("moment");


initDb().then(
    (val) => {
        database.defaults({logs: []})
            .write();
    },
    (reason) => {
        console.error(reason);
    });

function initDb() {
    return new Promise((resolve, reject) => {
        checkDirectory('db', function (err) {
            if (err) {
                reject(err);
            } else {
                fs.readdir('db', (err, files) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (files.length === 0) {
                            adapter = new FileSync('db/db-' + moment().format('YYYY-MM-DD-hh-mm-ss') + '.json');
                        } else {
                            files = _.sortBy(files);
                            adapter = new FileSync('db/' + files[files.length - 1]);
                        }
                        database = low(adapter);
                        resolve();
                    }
                });
            }
        });
    });
}

function checkDirectory(directory, callback) {
    fs.stat(directory, function (err, stats) {
        //Check if error defined and the error code is "not exists"
        if (err) {
            //Create the directory, call the callback.
            fs.mkdir(directory, callback);
        } else {
            //just in case there was a different error:
            callback(err)
        }
    });
}


let DBRepository = {
    create: (logObjects) => {
        return new Promise((resolve, reject) => {
            if (database.get(logsTable)
                .size()
                .value() > 2000) {
                adapter = new FileSync('db/db-' + moment().format('YYYY-MM-DD-hh-mm-ss') + '.json');
                database = low(adapter);
                database.defaults({logs: []})
                    .write();
            }
            let newLogs = _.map(logObjects, function (logObject) {
                return {
                    id: shortid.generate(),
                    sessionName: logObject.sessionName,
                    timestamp: logObject.timestamp,
                    message: logObject.message,
                    severity: logObject.severity
                };
            });

            _.each(newLogs, function (log) {
                database.get(logsTable).push(log).write();
            });
            resolve(newLogs);
        });
    },

    getAsString: (sessionName) => {
        return new Promise((resolve, reject) => {
            let logs = database.get(logsTable)
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
        });
    },
    getLogs: (lastUpdated, sessionName) => {
        return new Promise((resolve, reject) => {
            let logs = database.get(logsTable)
                .filter(function (log) {
                    if (lastUpdated && lastUpdated >= log.timestamp) {
                        return false
                    }
                    if (sessionName && sessionName !== log.sessionName) {
                        return false
                    }
                    return true;
                })
                .sortBy(timestamp)
                .value();
            return resolve(logs);
        });
    },
    delete: (sessionName) => {
        return new Promise((resolve, reject) => {
            let removed = database.get(logsTable)
                .remove(function (log) {
                    if (sessionName && sessionName !== log.sessionName) {
                        return false;
                    }
                    return true;
                }).write();
            return resolve(removed.length !== 0);
        });
    },
    getAllSessions: () => {
        return new Promise((resolve, reject) => {
            console.log(db.get(logsTable)
                .map('sessionName')
                .uniq()
                .value());
            let logs = db.get(logsTable)
                .map('sessionName')
                .uniq()
                .value();
            resolve(logs);
        });
    }
};

module.exports = DBRepository;