const joi = require('@hapi/joi');

const signupValidation = data => {
    const schema = joi.object({
        username: joi.string().min(6).required(),
        email: joi.string().min(6).required().email(),
        description: joi.string().min(20).required(),
        password: joi.string().min(6).required()
    });
    return schema.validate(data, {abortEarly: false});
}

const signinValidation = data => {
    const schema = joi.object({
        username: joi.string().min(6).required(),
        password: joi.string().min(6).required()
    });
    return schema.validate(data, {abortEarly: false});
}

module.exports.signupValidation = signupValidation;
module.exports.signinValidation = signinValidation;