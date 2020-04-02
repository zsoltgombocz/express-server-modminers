const router = require('express').Router();
const bcrypt = require('bcrypt')
const Keys_Model = require('../models/Keys')

router.get('/', async (req, res, next) => {

    const key = req.headers['authorization'];

    if(key != undefined) {
        if(await validateKey(key)) {
            res.status(200).json({'message':'OK'});
            next();
        }else{
            res.status(401).json({'message':'Unauthorized'});
        }
    }else{
        res.status(401).json({'message':'Unauthorized'});
    }
});

async function validateKey(key){
    let get;
    try {
        const token = await bcrypt.hash(key, 10);
        get = await Keys_Model.findOne({'key':token});
        if(get != null) {
            return true;
        }
        else {
            return false;   
        }

    } catch (error) {
        console.log(error)
    }
}

module.exports = router;