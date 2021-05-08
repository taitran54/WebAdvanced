require('dotenv').config()

const express = require('express');
const status = express.Router()

const Status = require('../models/status');
const user = require('../models/user');
const User = require ('../models/user')

status.post('/', (req, res) => {
    let { content } = req.body
    // console.log(content)
    user_id = req.session.passport.user
    // console.log(req.session.passport.user)
    new Status ({
        content: content,
        time: new Date(),
        user_post: user_id
    }).save()
    .then(async (status) => {
        let user_id = status.user_post
        // console.log(res.end())
        const user = await User.findOne({ _id : user_id })
        .then(user => {
            return user
        }).catch(err => {
            return err
        })
        // console.log(user)
        // console.log(3)
        return res.end(JSON.stringify({
            success: true,
            status_id: status._id,
            content: status.content,
            date: status.time,
            user_name: user.name,
            user_image: user.avatar
        }))
    })
    // .catch(err => {
    //     return res.end(JSON.stringify({
    //         success : false
    //     }))
    // })
})

module.exports = status