const express = require("express")
const mongoose = require('mongoose')
const passport = require('passport')
const flash = require('connect-flash')
const session = require('express-session')
const expressLayouts = require('express-ejs-layouts')
const indexRoutes = require('./routes/index')
const userRoutes = require('./routes/users')
require('./config/passport')(passport)

const app = express()
const port = process.env.PORT
// Ejs
app.use(expressLayouts)
app.set('view engine','ejs')

// bodyparser
app.use(express.urlencoded({ extended: false }))

// add session

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}))

// passport middle

app.use(passport.initialize());
app.use(passport.session());

// connect flash
app.use(flash())

// Global vars
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error= req.flash('error')

    next()
})

// Routes register
app.use('/',indexRoutes)
app.use('/users',userRoutes)

// Mongodb database connection

mongoose.connect(process.env.DBURL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log('Mongodb connected')
}).catch(e=>{
    console.log(e.message)
})


app.listen(port,()=>{
    console.log(`server is up and running at port : ${port}`)
})