"use strict";

let LogValidator = {

    validate: (req, callback) => {

        for(let i = 0; i < req.body.length; i++)  {
            req.checkBody([i, 'timestamp']).notEmpty();
            req.checkBody([i, 'sessionName']).notEmpty();
            req.checkBody([i, 'message']).notEmpty();
            req.checkBody([i, 'severity']).notEmpty();
        }

        req.getValidationResult().then(callback);

        // TODO check if severity is valid
    }
};


module.exports = LogValidator;