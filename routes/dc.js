const express = require('express')
const router = express.Router();
const User = require('../models/User')

const authroute = require('../routes/auth')
router.use('/', authroute)

//SUBMIT
router.post('/', async (req,res) => {
    res.send("dc")
});

module.exports = router;