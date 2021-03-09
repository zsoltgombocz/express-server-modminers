const express = require('express')
const router = express.Router();
const Log = require('../models/Logs')
const { saveLogValidation } = require('../validation')

const authroute = require('../routes/auth')

router.use('/:id', authroute)
router.use('/delete/userid/:id', authroute)

//SUBMIT
router.post('/', async (req,res) => {

        const {error} = saveLogValidation(req.body);
    
        if(error) {
            return res.status(400).json(error)
        }
    
        const log = new Log({
            user_id: req.body.user_id,
            message: req.body.message,
            variant: req.body.variant,
            icon: req.body.icon
        });
    
        try{
            const savedLog = await log.save()
            res.sendStatus(200)
        }catch(err){
            res.json({message: err})
        }
});
//GET SPECIFIC
router.get('/:id', async (req,res) => {
    
        try {
            if(req.params.id === "admin" && res.locals.data.admin === true) {
                const admin_logs = await Log.find({user_id: req.params.id})
                res.json(admin_logs)
            }else{
                const logs = await Log.find({user_id: req.params.id})
                res.json(logs) 
            }
        } catch (err) {
            res.json({message: err.message}) 
        }
});
//DELETE BY USERID
router.delete('/delete/userid/:id', async (req, res) => {

    if(req.params.id === null) return res.status(400).json({message: 'Nem megfelelő kérés! Hiányzó mező!'});

    if(res.locals.data){
        if(res.locals.data.admin === true){
            try {
                const deleted = await Log.deleteMany({user_id: req.params.id})
                return res.status(200).json(deleted)
            } catch (error) {
                return res.status(500).json({message: 'Váratlan hiba történt!', error: error.message});
            }
        }else{
           return res.status(401).json({message:'Nem engedélyezett művelet!'});
        }
    }else return res.status(401).json({message:'Nem engedélyezett művelet!'});
});
/*
//DELETE
router.delete('/:id', async (req,res) => {
    try {
        const removed = await Post.remove({_id: req.params.id});
        res.json(removed)
    } catch (err) {
        res.json({message: err}) 
    }
});
//UPDATE
router.patch('/:id', async (req,res) => {
    try {
        const updated = await Post.updateOne(
            {_id: req.params.id}, 
            {$set: {title: req.body.title}}
        );
        res.json(updated)
    } catch (err) {
        res.json({message: err}) 
    }
});
*/
module.exports = router;