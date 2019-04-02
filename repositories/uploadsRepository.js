"use strict";

const Promise = require('promise');
const _ = require('lodash');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const fs = require("fs");
const moment = require("moment");
const AdmZip = require('adm-zip');


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
    uploadZipFile: (buffer, fileName, folder) => {
        return new Promise((resolve, reject) => {
            checkDirectory('./uploads/zip').then(
                (val) => {
                    let zip = AdmZip(buffer);
                    var zipEntries = zip.getEntries();
                    checkDirectory('./uploads/zip/' + folder).then(
                        (val) => {
                            zipEntries.forEach(function (zipEntry) {
                                zip.extractEntryTo(/*entry name*/zipEntry.entryName, /*target path*/'./uploads/zip/' + folder, /*maintainEntryPath*/false, /*overwrite*/true);
                            });
                            resolve();
                        },
                        (reason) => {
                            reject();
                        });
                },
                (reason) => {
                    reject(reason)
                });
        });
    }
};

module.exports = UploadsRepository;