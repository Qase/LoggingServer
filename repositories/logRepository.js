
const Promise = require('promise');

const UUID = require('uuid/v4');
const LogModel = require("../models/logModel").LogModel;

var logs = [];

let LogRepository = {
    create: (logObject) => {
        return new Promise((resolve, reject) => {
            // if (error) {
            //     return reject({value: error, code: 400});
            // }

            let resultLogObject = {
                id: UUID(),
                timestamp: logObject.timestamp,
                message: logObject.message,
                severity: logObject.severity
            };

            logs.push(resultLogObject);

            return resolve({value: resultLogObject, code: 201});
        });
    },
    getAll: () => {
        return new Promise((resolve, reject) => {
            // if (error) {
            //     return reject({value: error, code: 400});
            // }

            logs.sort(function(a, b) {
                var x = a.timestamp;
                var y = b.timestamp;
                if (x < y) { return -1; }
                if (x > y) { return 1; }
                return 0;
            });

            return resolve({value: logs, code: 200});
        });
    }
};

module.exports = LogRepository;