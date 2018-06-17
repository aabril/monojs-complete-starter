const Joi = require('joi') // joi is a dependency of mono

exports.createSession = {
    body: Joi.object().keys({
        email: Joi.string().min(1).required(),
        password: Joi.string().min(1).required(),
        username: Joi.string().min(1).required(),
    })
}

exports.getSession = {
}
