require('dotenv').config()

const express = require('express');
const resetpassword = express.Router()
const bcrypt = require('bcrypt')

const User = require('../models/user');
const passport = require('passport');


resetpassword.get( '/', (req, res) => {
    return res.render('resetpassword')
})

resetpassword.post('/', (req, res) => {
    let { oldpass, newpass } = req.body
    var user_id = req.session.passport.user_id
    User.findOne({_id: user_id})
    .then (user => {
        if (bcrypt.match(oldpass, user.password)){
            User.updateOne({_id: user_id}, {password: bcrypt.hash(newpass, 10)})
            return res.redirect('./status')
        }
        return res.redirect('./home')
    }).catch(err => {
        return res.redirect('./resetpassword')
    })
})

module.exports = resetpassword