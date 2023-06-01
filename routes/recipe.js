const express = require('express')
const router = express.Router()
const { ensureAuth} = require('../middleware/auth')

const Recipe = require('../models/Recipe')

router.get('/add', ensureAuth, (req,res) => {
    res.render('recipe/add')
})

module.exports = router