const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest} = require('../middleware/auth')

const Recipe = require ('../models/recipe')

//@desc Login/landing page
//@route GET /
router.get('/', ensureGuest, (req,res) => {
    res.render('login', {
        layout: 'login',
    
    })
})

//@desc Dashboard
//@route GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        const recipe = await Recipe.find({user: req.user.id}).lean()
        res.render('dashboard', {
            name: req.user.firstName,
            recipe
        })
    
        }catch (err) {
            console.error(err)

    }

})
module.exports = router