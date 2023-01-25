const path = require('path')
const express = require ('express')
const dotenv = require ('dotenv')
const morgan = require('morgan')
const exphbs = require ('express-handlebars')
const passport = require ('passport')
const session = require('express-session')
const connectDB = require ('./config/db') //import function


//load config 
dotenv.config({ path: './config/config.env'})

//Passport config 
require('./config/passport')(passport)


connectDB()//calling function 

const app = express() 


//Logging
if (process.env.NODE_ENV === 'development' ){
    app.use(morgan('dev'))
}

//Handlebars 
app.engine('.hbs', exphbs.engine({
defaultLayout:'main', //apply layout all of body elements
    extname:'.hbs'
    })
)
app.set('view engine', '.hbs')

//session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false, 
    saveUninitialized:true,
    cookie:{secure:true} 
})) 


//passport middleware 
app.use(passport.initialize())
app.use(passport.session())

//Static Folder 
app.use(express.static(path.join(__dirname,'public')))


//Routes
app.use('/', require('./routes/index'))


const PORT= process.env.PORT || 8000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))

