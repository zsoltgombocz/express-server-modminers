const express = require('express')
const router = express.Router();
const Page = require('../models/Page');
const { templateSettings } = require('underscore');
//SUBMIT
router.get('/', async (req,res) => {
    const setting = await Page.find().select('-_id -__v');
    if(setting.length == 1) {
        res.json(setting)
    }else{
        const new_setting = new Page({
            game: false
        });

        try{
            const savedSetting = await new_setting.save()
            delete savedSetting._id
            delete savedSetting.__v
            res.json(savedSetting)
        }catch(err){
            res.json({message: err})
        }
    }
});
//UPDATE
router.patch('/', async (req,res) => {
    const setting = await Page.findOne()
    if(setting && res.locals.data.admin) {
        try {
            setting.game = req.body.game

            await setting.save()

            res.json(setting)

        } catch (err) {
            res.json({message: err.message}) 
        }
    }else res.statusCode(401)
});

module.exports = router;