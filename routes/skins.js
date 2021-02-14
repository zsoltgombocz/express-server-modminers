const express = require('express')
const router = express.Router();
const Skins = require('../models/Skins')

const {SubmitSkinValidation} = require('../validation')

//GET ALL
router.get('/', async (req,res) => {
    try {
        const skins = await Skins.find();
        res.json(skins)
    }catch (err){
        res.status(500).json({message: err.message})
    }
});
router.get('/:sex/:id?', async (req,res) => {
    if(req.params.id == null) {
        try {
            const skins = await Skins.find({sex: req.params.sex});
            res.json(skins)  
        } catch (err) {
            res.jstatus(500).son({message: err.message})
        }
    }else{
        try {
            const skins = await Skins.findOne({sex: req.params.sex, id: req.params.id});
            res.json(skins)
        }catch (err){
            res.status(500).json({message: err.message})
        }
    }
});
//SUBMIT
router.post('/', async (req,res) => { 

    const {error} = SubmitSkinValidation(req.body);
    let msg = {}
    if(error){
        error.details.forEach(e => {
            msg[e.path] = e.message;
        });
        return res.status(400).send(msg)
    }else{

        const id_exist = await Skins.findOne({id: req.body.id, sex: req.body.sex})
        if(id_exist) msg["r_name"] = "Ez az id már foglalt!";

        if(Object.keys(msg).length != 0) {
            return res.status(400).json(msg);
        }else{
            const skin = new Skins({
                sex: req.body.sex,
                id: req.body.id
            });
            try{
                await skin.save();
                res.status(200).json({message: "Skin elmentve!"})
            }catch(err) {
                res.status(500).json({message: "Hiba történt a mentés során!", error: err.message});
            }
        }

    }


});
//GET SPECIFIC
router.get('/:id', async (req,res) => {
});

//DELETE
router.delete('/:id', async (req,res) => {
    try {
        const removed = await Skins.deleteOne({_id: req.params.id});
        res.status(200).json({message: "Skin törölve!"})
    } catch (err) {
        res.status(500).json({message: "Hiba történt a törlés során!", message: err.message}) 
    }
});
//UPDATE
router.patch('/:id', async (req,res) => {
});

module.exports = router;