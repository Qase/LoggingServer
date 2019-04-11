"use strict";

const express = require('express');
const UploadsRepository = require('../../repositories/uploadsRepository');
const busboy = require('connect-busboy');
const common = require('./common');

let uploadsRouter = express.Router();
uploadsRouter.use(busboy());

uploadsRouter.post('/uploads/zip/platforms/:platform/folders/:folder', (req, res, next) => {
    let folder = common.extractUrlParam(req, 'folder');
    let platform = common.extractUrlParam(req, 'platform');

    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, fileName) {
        var data = [], dataLen = 0;
        file.on('data', function (chunk) {
            data.push(chunk);
            dataLen += chunk.length;
        });
        file.on('end', function () {
            var buf = new Buffer(dataLen);
            for (var i = 0, len = data.length, pos = 0; i < len; i++) {
                data[i].copy(buf, pos);
                pos += data[i].length;
            }
            // var buf =  Buffer.from(data);
            UploadsRepository.uploadZipFile(platform, buf, folder).then(
                (val) => {
                    return res.status(200).send(val);
                },
                (reason) => {
                    return res.status(400).send(reason);
                });
        });
    });
});

uploadsRouter.get('/uploads/platforms/:platform/directories', (req, res, next) => {
    let platform = common.extractUrlParam(req, 'platform');
    UploadsRepository.getFolders(platform).then(
        (val) => {
            return res.status(200).send(val);
        },
        (reason) => {
            return res.status(400).send(reason);
        });
});
uploadsRouter.get('/uploads/platforms/:platform/directories/:directory', (req, res, next) => {
    let platform = common.extractUrlParam(req, 'platform');
    let directory = common.extractUrlParam(req, 'directory');
    UploadsRepository.getDbNames(platform, directory).then(
        (val) => {
            return res.status(200).send(val);
        },
        (reason) => {
            return res.status(400).send(reason);
        });
});
uploadsRouter.get('/uploads/platforms/:platform/directories/:directory/logs', (req, res, next) => {
    let platform = common.extractUrlParam(req, 'platform');
    let directory = common.extractUrlParam(req, 'directory');
    let dbName = common.extractQueryParam(req, 'dbName');
    UploadsRepository.getLogs(platform, directory, dbName).then(
        (val) => {
            return res.status(200).send(val);
        },
        (reason) => {
            return res.status(400).send(reason);
        });
});

module.exports = uploadsRouter;
