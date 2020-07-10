const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const rstring = require('randomstring');
const jwt = require('jsonwebtoken')

router.post('/rang', async (req, res) => {
    if(!isServer(req.headers.host)) {
        if(!req.body.username) return res.status(400).json({message: "Nincs mező kitöltve!"})
        try {
            const user = await User.findOne({username: req.body.username})

            return res.send("" + user.permissions.server)
        } catch (error) {
            return res.status(500).json({error:error})
        }
    }else{
        res.send("nem szerver")
    }
});

router.post('/ban/:name', async(req, res) => {
    if(!isServer(req.headers.host)) {
        if(!req.params.name) return res.status(400).json({message: "Nincs mező kitöltve!"})
        try {
            const user = await userModel.updateOne({ username: req.params.name }, {'permissions.server': -1, logout: true, admin: false})
        
            res.sendStatus(200)
        } catch (error) {
            return res.status(500).json({error:error})
        }
    }else{
        res.send("nem szerver")
    }
})

function isServer(ip) {
    if(ip === process.env.SERVER_ip){return true}
    else {return false}
}



module.exports = router;