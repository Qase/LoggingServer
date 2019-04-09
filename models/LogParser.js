"use strict";
const IosLogParser = require('./IosLogParser');
const AndroidLogParser = require('./AndroidLogParser');

let LogParser = {
    parse: (platform, fileContent) => {
        if (platform === 'IOS') {
            return IosLogParser.parse(fileContent);
        } else if (platform === 'ANDROID') {
            return AndroidLogParser.parse(fileContent);
        } else {
            throw new Error("Invalid platform");
        }
    }
};

module.exports = LogParser;