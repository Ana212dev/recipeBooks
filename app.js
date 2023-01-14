const express = require ('express')
const dotenv = require ('dotenv')
const connectDB = require ('./config/db') //import function


//load config 
dotenv.config({ path: './config/config.env'})
const app = express()
connectDB()//calling function 

const PORT= process.env.PORT || 8500

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))

