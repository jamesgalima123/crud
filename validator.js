const Validator = require('validatorjs');

module.exports = {
    validate: function(body,rules){
        const validation = new Validator(body,rules);

        return validation.fails() ? false : true;

    }
};