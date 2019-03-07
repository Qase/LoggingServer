"use strict";

let Common = {

    resolveGet: (promise, res) => {
        promise.then(
            (val) => {
                return res.status(200).send(val);
            },
            (reason) => {
                console.log(reason);
                return res.status(400).send(reason);
            });
    },
    extractQueryParam: (req, paramName) => {
        if (req.query.hasOwnProperty(paramName)) {
            return req.query[paramName];
        } else {
            return null;
        }
    },
    extractUrlParam: (req, paramName) => {
        if (req.params.hasOwnProperty(paramName)) {
            return req.params[paramName];
        } else {
            return null;
        }
    }
};

module.exports = Common;
