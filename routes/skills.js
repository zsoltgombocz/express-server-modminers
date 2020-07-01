const express = require('express')
const router = express.Router();
const Skills = require('../models/Skills')

const {SubmitSkillValidation} = require('../validation')

//GET ALL
router.get('/', async (req,res) => {
    try {
        const skills = await Skills.find();
        res.json(skills)
    }catch (err){
        res.json({message: err})
    }
});
//SUBMIT
router.post('/', async (req,res) => { 

    const {error} = SubmitSkillValidation(req.body);
    let msg = {}
    if(error){
        error.details.forEach(e => {
            msg[e.path] = e.message;
        });
        return res.status(400).send(msg)
    }else{

        const r_nameExist = await Skills.findOne({r_name: req.body.r_name})
        if(r_nameExist) msg["r_name"] = "Ez a registry_name már foglalt!";

        if(Object.keys(msg).length != 0) {
            return res.status(400).json(msg);
        }else{
            const skill = new Skills({
                r_name: req.body.r_name,
                d_name: req.body.d_name,
                price: req.body.price,
                desc: req.body.desc,
                requried: req.body.requried,
                group: req.body.group,
            });
            try{
                await skill.save();
                res.status(200).json({message: "Skill elmentve!"})
            }catch(err) {
                res.status(500).json({message: "Hiba történt a mentés során!", error: err});
            }
        }

    }


});
//GET SPECIFIC
router.get('/:id', async (req,res) => {
});

//DELETE
router.delete('/:id', async (req,res) => {
});
//UPDATE
router.patch('/:id', async (req,res) => {
});

module.exports = router;