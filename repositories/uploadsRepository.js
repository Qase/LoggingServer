"use strict";

const Promise = require('promise');
const _ = require('lodash');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const fs = require("fs");
const moment = require("moment");
const AdmZip = require('adm-zip');
const LogParser = require('../models/LogParser');


function checkDirectory(directory) {
    return new Promise((resolve, reject) => {
        fs.stat(directory, function (err, stats) {
            //Check if error defined and the error code is "not exists"
            if (err) {
                //Create the directory, call the callback.
                fs.mkdir(directory, {recursive: true}, function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve()
                    }
                });
            } else {
                //just in case there was a different errogr:
                resolve()
            }
        });
    });
}

let UploadsRepository = {
    uploadZipFile: (platform, buffer, fileName, folder) => {
        return new Promise((resolve, reject) => {
            let zip = AdmZip(buffer);
            let zipEntries = zip.getEntries();
            checkDirectory('./uploads/' + platform + '/db/' + folder).then(
                (val) => {
                    zipEntries.forEach(function (zipEntry) {
                        let logArray = LogParser.parse(platform, zipEntry.getData().toString('utf8'));
                        if (logArray.length > 0) {
                            let filePath = './uploads/' + platform + '/db/' + folder + '/' + zipEntry.name.replace(".log", "") + '.json';
                            try {
                                fs.unlinkSync(filePath);
                            }
                            catch (e) {
                            }
                            let adapter = new FileSync(filePath);
                            let database = low(adapter);
                            database.defaults({logs: []}).write();
                            database.get("logs").push(logArray).write();
                        }
                    });
                    resolve();
                },
                (reason) => {
                    reject();
                });

        });
    }
};

module.exports = UploadsRepository;