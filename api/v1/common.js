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
    }
};

module.exports = Common;
