require('dotenv').config()

const express = require('express');
const notifications = express.Router()

const User = require('../models/user')
const Notifications = require('../models/notifications')

notifications.get('/', (req, res) => {
    return res.render('post_noti')
})

notifications.post('/', (req, res) => {
    let { title, content } = req.body
    user_id = req.session.passport.user

    new Notifications ({
        title: title,
        content: content,
        time: new Date(),
        user_comment: user_id
    }).save()
    .then(notifications => {
        return res.redirect('../home')
     }).catch (err => {
         return res.end("Fail")
     })
})

module.exports = notifications