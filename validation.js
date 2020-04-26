const joi = require('@hapi/joi');

const message = {
    "string.base": `Karaktereket kell tartalmaznia!`,
    "string.empty": `Nem lehet üres!`,
    "string.min": `Minimum {#limit} karakter!`,
    "string.max": `Maximum {#limit} karakter!`,
    "any.required": `Kitöltése kötelező!`
}

const registerValidation = data => {
    const schema = joi.object().keys({
        username: joi.string().min(6).required().messages(message),
        email: joi.string().min(6).required().email().messages(message),
        description: joi.string().min(20).required().messages(message),
        password: joi.string().min(6).required().messages(message)
    });
    return schema.validate(data, {abortEarly: false});
}

const loginValidation = data => {
    const schema = joi.object().keys({
        username: joi.string().min(6).required().messages(message),
        password: joi.string().min(6).required().messages(message)
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