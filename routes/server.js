const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const rstring = require('randomstring');
const jwt = require('jsonwebtoken')

router.post('/user', async (req, res) => {
    if(isServer) {
        res.send("szerver")
    }else{
        res.send("nem szerver")
    }
});

function isServer(ip) {
    if(ip === process.env.SERVER_ip) return true
    else return false
}



module.exports = router;