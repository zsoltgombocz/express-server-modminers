const express = require('express')
const router = express.Router();
const userModel = require('../models/User')
const bcrypt = require('bcrypt')
const {loginValidation, registerValidation, emailValidation} = require('../validation')
const { logger } = require('../services/logger')


router.post('/register', async (req,res) => {
    const {error} = registerValidation(req.body);
    if(error){
        let msg = ""
        error.details.forEach(e => {
            msg += e.message + "\n";
        });
        return res.status(400).send(msg)
    }else{
        const usernameExist = await userModel.findOne({username: req.body.username})
        if(usernameExist) return res.status(400).json({message: "A felhasználónév foglalt!"})

        const emailExist = await userModel.findOne({email: req.body.email})
        if(usernameExist) return res.status(400).json({message:"Az email foglalt!"})
        
        
        const validemail = await emailValidation(req.body.email)
        if(!validemail) return res.status(400).json({message:"Csak 'gmail.com' kiterjesztésü emailt fogadunk el!"})

        const hashedpass = await bcrypt.hash(req.body.password, 10);

        const user = new userModel({
            username: req.body.username,
            email: req.body.email,
            description: req.body.description,
            password: hashedpass
        });
        try{
            const savedUser = await user.save();
            res.json({message: "Regisztráció sikeresen megtörtént!", u_id: savedUser._id})
        }catch(err) {
            res.status(400).send(err);
        }
    }
})

router.post('/login', async (req,res) => {

    const {error} = loginValidation(req.body);
    if(error){
        let msg = ""
        error.details.forEach(e => {
            msg += e.message + "\n";
        });
        return res.status(400).send(msg)
    }else{
        const loginUser = await userModel.findOne({username:req.body.username});
        if(!loginUser) return res.json({message: "A felhasználónév nem létezik!"});

        const validPassword = await bcrypt.compare(req.body.password, loginUser.password);

        if(!validPassword) return res.status(400).json({message: "Nem megfelelő név/jelszó párosítás!"});

        res.json({message: "Sikeres belépés", user: loginUser})
    }
})



module.exports = router