"use strict";

let LogValidator = {

    validate: (req, callback) => {

        let schema = {
            'timestamp': {
                notEmpty: true,
                errorMessage: 'Timestamp mast be provided'
            },
            'message': {
                notEmpty: true,
                errorMessage: 'Message must be provided'
            },
            'severity': {
                notEmpty: true,
                errorMessage: 'Invalid Severiy provided'
            }
        };

        req.checkBody(schema);
        req.getValidationResult().then(callback);

        // TODO check if severity is valid
    }
};


module.exports = LogValidator;