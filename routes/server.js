const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const rstring = require('randomstring');
const jwt = require('jsonwebtoken')

router.post('/rang', async (req, res) => {
    console.log(req.headers['x-real-ip'] || req.connection.remoteAddress)
    if(isServer(req.ip)) {
        if(!req.body.username) return res.status(400).json({message: "Nincs mező kitöltve!"})
        try {
            const user = await User.findOne({username: req.body.username})

            return res.send("" + user.permissions.server)
        } catch (error) {
            return res.status(500).json({error:error})
        }
    }else{
        res.send("nem szerver" + req.headers['x-real-ip'] || req.connection.remoteAddress)
    }
});

router.post('/ban/:name', async(req, res) => {
    if(isServer(req.ip)) {
        if(!req.params.name) return res.status(400).json({message: "Nincs mező kitöltve!"})
        try {
            const user = await User.updateOne({ username: req.params.name }, {'permissions.server': -1, logout: true, 'permissions.admin': false})
        
            res.sendStatus(200)
        } catch (error) {
            return res.status(500).json({error:error.message})
        }
    }else{
        res.sendStatus(400)
    }
})

function isServer(ip) {
    if(ip === process.env.SERVER_IP){return true}
    else {return false}
}



module.exports = router;