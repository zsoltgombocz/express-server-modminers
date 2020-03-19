const express = require('express')
const router = express.Router();
const Post = require('../models/Post')
//GET ALL
router.get('/', async (req,res) => {
    try {
        const posts = await Post.find();
        res.json(posts)
    }catch (err){
        res.json({message: err})
    }
});
//SUBMIT
router.post('/', async (req,res) => {
    const post = new Post({
        title: req.body.title,
        body: req.body.body
    });
    try{
        const savedPost = await post.save()
        res.json(savedPost)
    }catch(err){
        res.json({message: err})
    }
});
//GET SPECIFIC
router.get('/:id', async (req,res) => {
    try {
        const post = await Post.findById(req.params.id)
        res.json(post) 
    } catch (err) {
       res.json({message: err}) 
    }
});

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

module.exports = router;