require('dotenv').config()

const express = require('express')
const homePage = express.Router()

const User = require('../models/user')

homePage.get('/', (req, res) => {
    user_id = req.session.passport.user
    User.findOne( { _id : user_id } )
        .then (user => {
            // console.log (user)
            let result = new Object()
            result.name = user.name
            result.avatar_image = user.avatar
            // console.log(result)
            return res.render('index', result)
        })
})

module.exports = homePage
