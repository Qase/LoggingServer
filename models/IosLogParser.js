"use strict";
const shortid = require('shortid');

let moment = require('moment');
let IosLogParser = {
    parse: (fileContent) => {
        let logChunks = fileContent.split('<-- QLog -->');
        const logArray = [];
        try {
            logChunks.forEach(function (chunk) {
                let log = IosLogParser.parseChunk(chunk);
                if (log) {
                    logArray.push(log)
                }
            });
        } catch (e) {
            console.log(e);
        }
        return logArray;
    },
    parseChunk(chunk) {
        try {
            let severityDate = chunk.substring(chunk.indexOf("["), chunk.indexOf("]") + 1);
            let severity = severityDate.substring(1, severityDate.indexOf(" "));
            let date = severityDate.substring(severityDate.indexOf(" ") + 1, severityDate.indexOf("]"));
            let text = chunk.substring(chunk.indexOf("]") + 1);
            const timestamp = moment(date, 'YYYY-MM-DD hh:mm:ss').unix();
            return {
                id: shortid.generate(),
                timestamp: timestamp,
                message: text,
                severity: severity,
            };

        } catch (e) {
            console.log(e);
            return null;
        }
    }
};

module.exports = IosLogParser;