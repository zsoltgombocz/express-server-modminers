const express = require('express')
const router = express.Router();
const userModel = require('../models/User')
const bcrypt = require('bcrypt')
const authroute = require('../routes/auth')
const email = require('../services/email')
const {loginValidation, registerValidation, emailValidation, sendEmailValidation, savePasswordvalidation} = require('../validation')
const jwt = require('jsonwebtoken')

router.use('/sendemail', authroute)
router.use('/getdata/:id', authroute)
router.use('/update/:id', authroute)


router.post('/register', async (req,res) => {
    const {error} = registerValidation(req.body);
    let msg = {};
    if(error){
        error.details.forEach(e => {
            msg[e.path] = e.message;
        });
         console.log('[LOG] Hiba a regisztráció során!\n[LOG] Kapott adat:'+JSON.stringify(req.body)+'\n[LOG] Kapott hiba:' + JSON.stringify(msg))
         return res.status(400).send(msg)
    }else{
        const usernameExist = await userModel.findOne({username: req.body.username})
        if(usernameExist) msg["username"] = "A felhasználónév foglalt!"; //return res.status(400).json({message: "A felhasználónév foglalt!"})

        const emailExist = await userModel.findOne({'email.email': req.body.email})
        if(emailExist) msg["email"] ="Az email foglalt!"; //return res.status(400).json({message:"Az email foglalt!"})
        
        
        const validemail = emailValidation(req.body.email)
        if(!validemail) msg["validemail"] = "Csak 'gmail.com' kiterjesztésű emailt fogadunk el!"; //return res.status(400).json({message:"Csak 'gmail.com' kiterjesztésű emailt fogadunk el!"})
        
        if(Object.keys(msg).length != 0) {
            console.log('[LOG] Hiba a regisztráció során!\n[LOG] Kapott adat:'+JSON.stringify(req.body)+'\n[LOG] Kapott hiba:' + JSON.stringify(msg))
            return res.status(400).json(msg);
        }else{
            const hashedpass = await bcrypt.hash(req.body.password, 10);

            const email_key = await authroute.createKey();

            const user = new userModel({
                username: req.body.username,
                'email.email': req.body.email,
                'email.ver_code': email_key,
                description: req.body.description,
                'password.password': hashedpass
            });
            try{
                await user.save();
                await email.send(req.body.email, 'verifyUser', {username: req.body.username, verify: {root: process.env.ROOT, email: req.body.email, key: email_key}})
                res.status(200).json({message: "Regisztráció sikeresen megtörtént!"})
            }catch(err) {
                res.status(500).json({message: "Hiba történt a regisztráció során!", error: err});
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
        console.log('[LOG] Hiba a belépés során!\n[LOG] Kapott adat:'+JSON.stringify(req.body)+'\n[LOG] Kapott hiba:' + JSON.stringify(msg))
        return res.status(400).send(msg)
    }else{
        const loginUser = await userModel.findOne({username:req.body.username});
        if(!loginUser)  {
            msg["username"] =  "A felhasználónév nem létezik!"; //return res.json({message: "A felhasználónév nem létezik!"});
        }else{
            const validPassword = await bcrypt.compare(req.body.password, loginUser.password.password);
        
            if(!validPassword) msg["password"] =  "Nem megfelelő név/jelszó párosítás!"; //return res.status(400).json({message: "Nem megfelelő név/jelszó párosítás!"});
        }

        if(Object.keys(msg).length != 0) {
            console.log('[LOG] Hiba a belépés során!\n[LOG] Kapott adat:'+JSON.stringify(req.body)+'\n[LOG] Kapott hiba:' + JSON.stringify(msg))
            return res.status(400).json(msg)
        }else{
            if(!loginUser.email.verified) {
                console.log('[LOG] Hiba a belépés során!\n[LOG] Kapott adat:'+JSON.stringify(req.body)+'\n[LOG] Kapott hiba:' + JSON.stringify({email_notverified: "Az e-mail cím nincs megerősítve."}))
                return res.status(400).json({email_notverified: "Az e-mail cím nincs megerősítve."})
            }
            if(!loginUser.permissions.verified) {
                console.log('[LOG] Hiba a belépés során!\n[LOG] Kapott adat:'+JSON.stringify(req.body)+'\n[LOG] Kapott hiba:' + JSON.stringify({user_notverified: "A fiók nincs elbírálva. Adminjaink amint tudják elbírálják kérésed."}))
                return res.status(400).json({user_notverified: "A fiók nincs elbírálva. Adminjaink amint tudják elbírálják kérésed."})
            }

            const token = jwt.sign({_id:loginUser._id, username: loginUser.username, admin: loginUser.permissions.admin, perm: loginUser.permissions.server}, process.env.TOKEN_SECRET)

            return res.header('auth', token).json({success: true, message: "Sikeres belépés", token: token, user: {_id: loginUser._id, username: loginUser.username, sex: loginUser.sex, s_rang: loginUser.permissions.server, email: loginUser.email.email, skin: loginUser.skin}})
        }
    }
})

router.post('/sendemail', async (req, res) => {

    const {error} = sendEmailValidation(req.body);
    let msg = {};
    if(error){
        error.details.forEach(e => {
            msg[e.path] = e.message;
        });
         console.log('[LOG] Hiba az email küldés során!\n[LOG] Kapott adat:'+JSON.stringify(req.body)+'\n[LOG] Kapott hiba:' + JSON.stringify(msg))
         return res.status(400).send(msg)
    }else{
        const usernameExist = await userModel.findOne({username: req.body.username, 'email.email': req.body.email})
        if(!usernameExist) msg["username"] = "A felhasználónév / e-mail párosítás nem megfelelő!"; //return res.status(400).json({message: "A felhasználónév foglalt!"})

        const validemail = emailValidation(req.body.email)
        if(!validemail) msg["validemail"] = "Csak 'gmail.com' kiterjesztésű emailt fogadunk el!"; //return res.status(400).json({message:"Csak 'gmail.com' kiterjesztésű emailt fogadunk el!"})
        
       /* const emailVerified = await userModel.findOne({'email.verified': true, 'email.ver_code': ''})
        if(!emailVerified) msg["email"] = "Az e-mail cím nincs megerősítve!";*/

        if(Object.keys(msg).length != 0) {
            console.log('[LOG] Hiba az email küldés során!\n[LOG] Kapott adat:'+JSON.stringify(req.body)+'\n[LOG] Kapott hiba:' + JSON.stringify(msg))
            return res.status(400).json(msg);
        }else{
            let h_code = undefined;
            if(req.body.h_key === "true") {
                h_code = await authroute.createKey();
            }
            try{
                await email.send(req.body.email, req.body.template, {username: req.body.username, verify: {root: process.env.ROOT, email: req.body.email, key: h_code}})
                res.status(200).json({message: "E-mail elküldve!"})
            }catch(err) {
                res.status(500).json({message: "Hiba történt az email küldés során!", error: err.message});
            }
        }
    }
})

router.post('/verifyEmail', async (req, res) => {
    if(!req.query.username || !req.query.email || !req.query.key) return res.status(400).json({message: 'Nem megfelelő kérés!'})

    const payload = {
        username: req.query.username,
        'email.email': req.query.email,
        'email.verified': false
    }
    try {
        const user = await userModel.findOne(payload);
        if(user === null) return res.status(400).json({message: 'Nem megfelelő kérés! Az e-mail cím már aktiválva van.'});

        if(user.email.ver_code != req.query.key) return res.status(400).json({message: 'Nem megfelelő kérés! Nem létező kulcs!'});

        const validKey = await authroute.validateKey(req.query.key);

        if(validKey) {
            await user.updateOne({'email.verified': true, 'email.ver_code': ''})
            return res.status(200).json({valid: true});
        }else{
            return res.status(400).json({message: 'Nem megfelelő kérés! A megadott kulcs helytelen.'});
        }
    } catch (error) {
        return res.status(500).json({message: 'Váratlan hiba történt!', error: error});
    }
});

router.post('/sendNewPassword', async (req, res) => {

    const {error} = sendEmailValidation(req.body);
    let msg = {};
    if(error){
        error.details.forEach(e => {
            msg[e.path] = e.message;
        });
         console.log('[LOG] Hiba az email küldés során!\n[LOG] Kapott adat:'+JSON.stringify(req.body)+'\n[LOG] Kapott hiba:' + JSON.stringify(msg))
         return res.status(400).send(msg)
    }else{
        const usernameExist = await userModel.findOne({username: req.body.username, 'email.email': req.body.email})
        if(!usernameExist) msg["username"] = "A felhasználónév / e-mail párosítás nem megfelelő!"; //return res.status(400).json({message: "A felhasználónév foglalt!"})

        const validemail = emailValidation(req.body.email)
        if(!validemail) msg["validemail"] = "Csak 'gmail.com' kiterjesztésű emailt fogadunk el!"; //return res.status(400).json({message:"Csak 'gmail.com' kiterjesztésű emailt fogadunk el!"})
        
        const emailVerified = await userModel.findOne({'email.verified': true, 'email.ver_code': ''})
        if(!emailVerified) msg["email"] = "Az e-mail cím nincs megerősítve!";

        if(Object.keys(msg).length != 0) {
            console.log('[LOG] Hiba az email küldés során!\n[LOG] Kapott adat:'+JSON.stringify(req.body)+'\n[LOG] Kapott hiba:' + JSON.stringify(msg))
            return res.status(400).json(msg);
        }else{
            let h_code = undefined;
            if(req.body.h_key === "true") {
                h_code = await authroute.createKey();
            }
            try{
                await email.send(req.body.email, req.body.template, {username: req.body.username, verify: {root: process.env.ROOT, email: req.body.email, key: h_code}})
                await usernameExist.updateOne({'password.password_code': h_code, 'password.request': true})
                res.status(200).json({message: "E-mail elküldve!"})
            }catch(err) {
                res.status(500).json({message: "Hiba történt az email küldés során!", error: err.message});
            }
        }
    }
});
//VALID TRUE, FRONTEND 2 JELSZÓ MEZŐ KELL, MEG NÉV + EMAIL OLDAL ERROR MESSAGEKKEL
router.post('/newPassword', async (req, res) => {
    if(!req.query.username || !req.query.email || !req.query.key) return res.status(400).json({message: 'Nem megfelelő kérés!'})

    const payload = {
        username: req.query.username,
        'email.email': req.query.email,
        'password.request': true
    }
    try {
        const user = await userModel.findOne(payload);
        if(user === null) return res.status(400).json({message: 'Nem megfelelő kérés! Ehhez a fiókhoz nem kértek új jelszót!'});

        if(user.password.password_code != req.query.key) return res.status(400).json({message: 'Nem megfelelő kérés! Nem létező kulcs!'});

        const validKey = await authroute.validateKey(req.query.key, false);

        if(validKey) {
            return res.status(200).json({valid: true});
        }else{
            return res.status(400).json({message: 'Nem megfelelő kérés! A megadott kulcs helytelen!'});
        }
    } catch (error) {
        return res.status(500).json({message: 'Váratlan hiba történt!', error: error});
    }
});

router.post('/savePassword', async (req, res) => {

    const {error} = savePasswordvalidation(req.body);
    let msg = {};
    if(error){
        error.details.forEach(e => {
            msg[e.path] = e.message;
        });
         console.log('[LOG] Hiba a jelszó mentés során!\n[LOG] Kapott adat:'+JSON.stringify(req.body)+'\n[LOG] Kapott hiba:' + JSON.stringify(msg))
         return res.status(400).send(msg)
    }else{
        const payload = {
            'password.password_code': req.body.key,
            'password.request': true
        }
        try {
            const user = await userModel.findOne(payload);
            if(user === null) return res.status(400).json({message: 'Nem megfelelő kérés! Ehhez a fiókhoz nem kértek új jelszót!'});

            if(user.password.password_code != req.body.key) return res.status(400).json({message: 'Nem megfelelő kérés! Nem létező kulcs!'});

            const validKey = await authroute.validateKey(req.body.key, true);

            if(validKey) {
                const hashedpass = await bcrypt.hash(req.body.password, 10);

                const updated = await userModel.updateOne(
                    payload, 
                    {$set: {'password.password': hashedpass, 'password.password_code': '', 'password.request': false}}
                );
                res.json({success: true})
            }else{
                return res.status(400).json({message: 'Nem megfelelő kérés! A megadott kulcs helytelen!'});
            }
        } catch (error) {
            return res.status(500).json({message: 'Váratlan hiba történt!', error: error});
        }
    }
});

router.get('/getdata/:id', async (req, res) => {

    if(req.params.id === null) return res.status(400).json({message: 'Nem megfelelő kérés! Hiányzó mező!'});

    try {
        if(res.locals.data._id == req.params.id) {
            const user = await userModel.findOne({_id: req.params.id});
            if(user === null) return res.status(400).json({message: 'Nem megfelelő kérés! Nem létező fiók!'});
    
            res.status(200).json(user)
        }else{
            if(res.locals.data.admin === true) {
                const user = await userModel.findOne({_id: req.params.id});
                if(user === null) return res.status(400).json({message: 'Nem megfelelő kérés! Nem létező fiók!'});

                res.status(200).json(user)
            }else{
                res.status(400).json({message: "Nem engedélyezett művelet!"})
            }
        }

    } catch (error) {
        return res.status(500).json({message: 'Váratlan hiba történt!', error: error.message});
    }
});

router.patch('/update/:id', async (req, res) => {
    console.log(req.params.id)

    if(req.params.id === null) return res.status(400).json({message: 'Nem megfelelő kérés! Hiányzó mező!'});

    if(res.locals.data){

        if(res.locals.data._id == req.params.id) {
            try {
                const user = await userModel.updateOne({ _id: req.params.id }, req.body)
        
                res.sendStatus(200)
            } catch (error) {
                return res.status(500).json({message: 'Váratlan hiba történt!', error: error.message});
            }
        }else{
            if(res.locals.data.admin === true){
                try {
                    const user = await userModel.updateOne({ _id: req.params.id }, req.body)
            
                    res.status(200).sendStatus(200)
                } catch (error) {
                    return res.status(500).json({message: 'Váratlan hiba történt!', error: error.message});
                }
            }else{
                return res.status(401).json({message:'Nem engedélyezett művelet!'});
            }
        }
    }
});



module.exports = router