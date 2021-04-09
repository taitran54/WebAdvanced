const express = require('express');
const { model } = require('mongoose');
const login = express.Router()
const passport = require('passport')

login.get('/', function (req, res) {
    return res.render('login'); // load the login page
});
  
  
passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
    .then(user => done(null, user))
    .catch(err => done(err, null));
})

module.exports = login