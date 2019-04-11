"use strict";
const shortid = require('shortid');

let moment = require('moment');
let AndroidLogParser = {
    parse: (fileContent) => {
        let logChunks = fileContent.split('\n');
        const logArray = [];
        try {
            logChunks.forEach(function (chunk) {
                try {
                    let newLog = AndroidLogParser.parseChunk(chunk);
                    logArray.push(newLog);
                } catch (e) {
                    if (logArray.length > 0) {
                        logArray[logArray.length - 1].message = logArray[logArray.length - 1].message + "\n" + chunk;
                    }
                }
            });
        } catch (e) {
        }
        return logArray;
    },
    parseSeverity: function (severityTag) {
        if (severityTag === 'D') {
            return "DEBUG";
        } else if (severityTag === 'E') {
            return "ERROR";
        } else if (severityTag === 'V') {
            return "VERBOSE";
        } else if (severityTag === 'I') {
            return "INFO";
        } else if (severityTag === 'W') {
            return "WARNING";
        } else if (severityTag === 'A') {
            return "ASSERT";
        } else {
            throw new Error("Invalid severity: " + severityTag);
        }
    },
    parseChunk(chunk) {
        let date = chunk.substr(0, chunk.indexOf('/'));
        let rest = chunk.substr(chunk.indexOf('/') + 1);
        let severityTag = rest.substr(rest.indexOf(' ') + 1, 1);
        let text = rest.substr(rest.indexOf(' ') + 1);
        let severity = AndroidLogParser.parseSeverity(severityTag);

        const timestamp = moment(date, 'YYYY-MM-DD hh:mm:ss.SSS').unix() * 1000;
        if (!timestamp || isNaN(timestamp)) {
            throw new Error("Invalid date: " + date);
        }
        return {
            id: shortid.generate(),
            timestamp: timestamp,
            message: text,
            severity: severity,
        };
    }
};


module.exports = AndroidLogParser;