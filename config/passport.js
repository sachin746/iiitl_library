const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


//Load user model
const User = require('../models/User')

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            //Match user
            User.findOne({ email: email.toLowerCase() })
                .then(user => {
                    if (!user) {
                        return done(null, false, { message: 'that email is not registed' })
                    }
                    //Match password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;
                        if (isMatch) {
                            return done(null, user);
                        } else {
                            done(null, false, { message: 'Password incorrect' })
                        }
                    })
                })
                .catch(err => console.log(err));
        })
    );
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    })
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        })
    })
}