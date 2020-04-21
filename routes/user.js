const express = require('express')
const router = express.Router();
const userModel = require('../models/User')
const bcrypt = require('bcrypt')
const {loginValidation, registerValidation, emailValidation} = require('../validation')
const { logger } = require('../services/logger')


router.post('/register', async (req,res) => {
    const {error} = registerValidation(req.body);
    let msg = {};
    if(error){
        error.details.forEach(e => {
            msg[e.path] = e.message;
        });
        return res.status(400).send(msg)
    }else{
        const usernameExist = await userModel.findOne({username: req.body.username})
        if(usernameExist) msg["username"] = "A felhasználónév foglalt!"; //return res.status(400).json({message: "A felhasználónév foglalt!"})

        const emailExist = await userModel.findOne({email: req.body.email})
        if(emailExist) msg["email"] ="Az email foglalt!"; //return res.status(400).json({message:"Az email foglalt!"})
        
        
        const validemail = await emailValidation(req.body.email)
        if(!validemail) msg["validemail"] = "Csak 'gmail.com' kiterjesztésű emailt fogadunk el!"; //return res.status(400).json({message:"Csak 'gmail.com' kiterjesztésű emailt fogadunk el!"})
        if(Object.keys(msg).length != 0) {
            return res.status(400).json(msg);
        }else{
            const hashedpass = await bcrypt.hash(req.body.password, 10);

            const user = new userModel({
                username: req.body.username,
                email: req.body.email,
                description: req.body.description,
                password: hashedpass
            });
            try{
                const savedUser = await user.save();
                res.json({message: "Regisztráció sikeresen megtörtént!"})
            }catch(err) {
                res.status(500).send(err);
            }
        }
    }
})

router.post('/login', async (req,res) => {

    const {error} = loginValidation(req.body);
    let msg = {}
    if(error){
        error.details.forEach(e => {
            msg[e.path] = e.message;
        });
        return res.status(400).send(msg)
    }else{
        const loginUser = await userModel.findOne({username:req.body.username});
        if(!loginUser)  msg["username"] =  "A felhasználónév nem létezik!"; //return res.json({message: "A felhasználónév nem létezik!"});

        const validPassword = await bcrypt.compare(req.body.password, loginUser.password);

        if(!validPassword) msg["password"] =  "Nem megfelelő név/jelszó párosítás!"; //return res.status(400).json({message: "Nem megfelelő név/jelszó párosítás!"});

        if(Object.keys(msg).length != 0) {
            return res.status(400).json(msg)
        }else{
            res.json({message: "Sikeres belépés", user: {"token":"Kéne"}})
        }
    }
})



module.exports = router