const joi = require('@hapi/joi');

const registerValidation = data => {
    const schema = joi.object().keys({
        username: joi.string().min(6).required(),
        email: joi.string().min(6).required().email(),
        description: joi.string().min(20).required(),
        password: joi.string().min(6).required()
    });
    return schema.validate(data, {abortEarly: false});
}

const loginValidation = data => {
    const schema = joi.object({
        username: joi.string().min(6).required(),
        password: joi.string().min(6).required()
    });
    return schema.validate(data, {abortEarly: false});
}

const emailValidation = data => {
    const validEmail = data.split('@');
    if(validEmail[1].startsWith("gmail.com")) return true
    return false
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.emailValidation = emailValidation;