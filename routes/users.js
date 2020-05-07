const express = require('express')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const User = require('../models/user')

const router = express.Router()

router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/register', (req, res) => {
    res.render('register')
})


router.post('/register',(req,res)=>{
    const { name, email, password, password2 } = req.body
    let errors = []

    // Check required fields
    if(!name || !email || !password || !password2){
        errors.push({ msg: 'Please fill in all fields'})
    }

    // check password match 
    if(password !== password2){
        errors.push({ msg: 'Passwords do not match' })
    }

    // check pass length
    if(password.length < 6){
        errors.push({ msg: 'Password Should contain at least 6 characters' })
    }

    if(errors.length > 0){
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        })
    }else{
        // validation pass
        User.findOne({ email }).
        then(user=>{
            if(user){
                errors.push({ msg:'Email is already registered!' })
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                }) 
            }else{
                const user = new User({
                    name,
                    email,
                    password
                })
                user.save().then(user=>{
                    req.flash('success_msg', 'You are now register and can log in')
                    res.redirect('/users/login')
                })
            }
        })
    }
})

// login handler

router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/dashboard',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req,res,next)
})

// logout handle
router.get('/logout',(req,res)=>{
    req.logout()
    req.flash('success_msg', 'You are logout!')
    res.redirect('/users/login')
})

module.exports = router