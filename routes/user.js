const express = require('express')
const router = express.Router();
const userModel = require('../models/User')
const {signinValidation, signupValidation} = require('../validation')


//VALIDATION
const joi = require('@hapi/joi');

const schema = joi.object({
    username: joi.string().min(6).required(),
    email: joi.string().min(6).required().email(),
    description: joi.string().min(20).required(),
    password: joi.string().min(6).required()
});

router.post('/signup', async (req,res) => {

    //VALIDATE
    const {error} = signupValidation(req.body);
    if(error){
        let msg = ""
        error.details.forEach(e => {
            msg += e.message + "\n";
        });
        return res.status(400).send(msg)
    }else{
        const user = new userModel({
            username: req.body.username,
            email: req.body.email,
            description: req.body.description,
            password: req.body.password
        });
        try{
            const savedUser = await user.save();
            res.send(savedUser)
        }catch(err) {
            res.status(400).send(err);
        }
    }
})

module.exports = router