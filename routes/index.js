const express = require ('express')
const router = express.Router()
//@description Login/Landing page
//@route GET/
router.get('/', (req,res) => {
    res.send('Login')
})

//@description Dashboard
//@route GET/Dashboard
router.get('/dashboard', (req,res) => {
    res.send('Dashboard')
})

module.exports = router