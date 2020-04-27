const router = require('express').Router();
const bcrypt = require('bcrypt');
const Keys_Model = require('../models/Keys');
const rstring = require('randomstring');

router.get('/', async (req, res, next) => {

    const key = req.headers['authorization'];

    if(key != undefined) {
        if(await validateKey(key)) {
            next();
        }else{
            res.status(401).json({'message':'Unauthorized'});
        }
    }else{
        res.status(401).json({'message':'Unauthorized'});
    }
});

router.post('/', async (req, res, next) => {

    const key = req.headers['authorization'];

    if(key != undefined) {
        if(await validateKey(key)) {
            next();
        }else{
            res.status(401).json({'message':'Unauthorized'});
        }
    }else{
        res.status(401).json({'message':'Unauthorized'});
    }
});

router.get('/create', async (req, res, next) => {
    if(await validateKey(req.headers['authorization'])) {
        const newKey = await createKey();
        res.json({'key': newKey});
    }else{
        res.status(401).json({'message':'Unauthorized'});
    }

});

async function validateKey(key){
    let get;
    try {
        const token = await bcrypt.hash(key, 10);
        get = await Keys_Model.find();
        for (i = 0; i<get.length; i++) {
            const match = await bcrypt.compare(key, get[i].key)
            if(match) {
                return true;
            }else{
                continue;
            }
        }
    } catch (error) {
        console.log(error)
    }
}

async function createKey(){
    const key = await rstring.generate();
    const token = await bcrypt.hash(key, 10);
    const keyPost = Keys_Model({
        key: token 
    });
    try {
        const post = await keyPost.save();
        return key;

    } catch (error) {
        console.log(error)
    }
}



module.exports = router;