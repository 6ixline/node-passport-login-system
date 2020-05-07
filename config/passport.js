const mongoose = require('mongoose')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

const User = require('../models/user')

module.exports = function(passport){
    passport.use(
        new LocalStrategy({ usernameField:'email' }, async(email,password, done)=>{
            const user = await User.findOne({ email })

            if(!user){
                return done(null,false,{ message:'This email is not registered' })
            }

            const isMatch = await bcrypt.compare(password, user.password)
            if(isMatch){
                return done(null, user)
            }else{
                return done(null,false, { message:'Password Incorrect' })
            }

        })
    )
    passport.serializeUser( (user, done) =>{
        done(null, user.id);
    });

    passport.deserializeUser((id, done)=> {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
}