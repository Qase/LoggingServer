"use strict";

const express = require('express');
const UploadsRepository = require('../../repositories/uploadsRepository');
const busboy = require('connect-busboy');

let uploadsRouter = express.Router();
uploadsRouter.use(busboy());

uploadsRouter.post('/uploads/zip/platforms', (req, res, next) => {
    let folder = req.query.folder;
    let platform = req.query.platform;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
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
            UploadsRepository.uploadZipFile(buf, filename, folder).then(
                (val) => {
                    return res.status(200).send(val);
                },
                (reason) => {
                    return res.status(400).send(reason);
                });
        });
    });
});

module.exports = uploadsRouter;
