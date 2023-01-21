const express = require ('express')
const router = express.Router()
//@description Login/Landing page
//@route GET/
router.get('/', (req,res) => {
    res.render('Login')
})

//@description Dashboard
//@route GET/Dashboard
router.get('/dashboard', (req,res) => {
    res.render('dashboard')
})

module.exports = router