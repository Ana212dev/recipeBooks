const path = require('path')
const express = require ('express')
const dotenv = require ('dotenv')
const morgan = require('morgan')
const exphbs = require ('express-handlebars')
const passport = require ('passport')
const session = require('express-session')
const MongoStore = require ('connect-mongo')
const connectDB = require ('./config/db') //import function


//load config 
dotenv.config({ path: './config/config.env'})

//Passport config 
require('./config/passport')(passport)


connectDB()//calling function 

const app = express() 

//Body Parser 
app.use(express.urlencoded({ extended: false}))
app.use(express.json())

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

//Session middleware
app.use(session({
        secret: 'keyboard cat',
        resave: false, 
        saveUninitialized: false,  
        store: MongoStore.create({
            mongoUrl: process.env.Mongo_URI
        })
    })
) 

//passport middleware 
app.use(passport.initialize())
app.use(passport.session())

//Static Folder 
app.use(express.static(path.join(__dirname,'public')))


//Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/recipe', require('./routes/recipe'))


const PORT= process.env.PORT || 8000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))

