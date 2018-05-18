"use strict";

let LogValidator = {

    validate: (req, callback) => {

        let schema = {
            'timestamp': {
                notEmpty: true,
                errorMessage: 'timestamp must be provided'
            },
            'sessionName': {
                notEmpty: true,
                errorMessage: 'sessionName name must be provided'
            },
            'message': {
                notEmpty: true,
                errorMessage: 'message must be provided'
            },
            'severity': {
                notEmpty: true,
                errorMessage: 'severity must be provided'
            }
        };

        req.checkBody(schema);
        req.getValidationResult().then(callback);

        // TODO check if severity is valid
    }
};


module.exports = LogValidator;