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

// @ description Display all public recipes
// @ route GET /recipe 
router.get('/', ensureAuth, async (req,res) => {
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

//@desc Show single recipe
//@Route GET /recipe/:id/
router.get('/:id', ensureAuth, async (req,res) => {
    try {
        let recipe = await Recipe.findById(req.params.id)
            .populate('user')
            .lean()
        
        if (!recipe) {
            return res.render('error/404')
            }
        
        res.render('recipe/show', {
            recipe
        })
        } catch (err) {
            console.error(err)
            res.render('error/404')
        }
})

// @ description Show page to edit 
// @ route GET /recipe/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
      const recipe = await Recipe.findOne({
        _id: req.params.id,
      }).lean()
  
      if (!recipe) {
        return res.render('error/404')
      }
  
      if (recipe.user != req.user.id) {
        res.redirect('/recipe')
      } else {
        res.render('recipe/edit', {
          recipe,
        })
      }
    } catch (err) {
      console.error(err)
      return res.render('error/500')
    }
  })

// @ description Update recipes
// @ route PUT /recipe/:id
router.put('/:id', ensureAuth, async (req,res) => {
    try{
        let recipe = await Recipe.findById(req.params.id).lean()

        if(!recipe) {
            return res.render('error/404')
        }

        if(recipe.user != req.user.id) {
            res.redirect('/recipe')
        } else {
        recipe = await Recipe.findOneAndUpdate({_id: req.params.id }, req.body, {
            new: true,
            runValidators: true,
        })

        res.redirect('/dashboard')
        }
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})

// @ description Delete recipe
// @ route DELETE /recipe/:id

router.delete('/:id', ensureAuth, async (req,res) => {
    try {
        await Recipe.remove({ _id: req.params.id })
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})

// @desc    User recipes
// @route   GET /recipe/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
    try {
      const recipe = await Recipe.find({
        user: req.params.userId,
        status: 'public',
      })
        .populate('user')
        .lean()
  
      res.render('recipe/index', {
        recipe,
      })
    } catch (err) {
      console.error(err)
      res.render('error/500')
    }
  })

module.exports = router