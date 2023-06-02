const express = require('express')
const router = express.Router()
const { ensureAuth} = require('../middleware/auth')

const Recipe = require('../models/Recipe')


// @ description Show the add recipes page
// @ route GET /recipe/add 
router.get('/add', ensureAuth, (req,res) => {
    res.render('recipe/add')
})

//@ description Process add from 
//@ route POST/recipes 
router.post('/', ensureAuth, async (req,res) => {
    try {
        req.body.user = req.user.id
        await Recipe.create(req.body)
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

// @ description Show the all recipes
// @ route GET /recipe/add 
router.get('/', ensureAuth, async (req, res) => {
    try {
        const recipe = await Recipe.find({status: 'public'})
        .populate('user')
        .sort({createdAt: 'desc'})
        .lean()
    res.render('recipe/index', {
        recipe
    })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

// @ description Show page to edit 
// @ route GET /recipe/edit/:id
router.get('/edit/:id', ensureAuth, async(req, res) => {
    const recipe = await Recipe.findOne({
        _id: req.params.id
    }).lean()
    if(!recipe){
        return res.render('error/404')
    }
    if (recipe.user != req.user.id){
        res.redirect('/recipe')
    } else{
        res.render ('recipe/edit', {
            recipe,
        })
        
    }
})

module.exports = router