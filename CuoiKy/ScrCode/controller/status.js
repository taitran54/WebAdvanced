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
            isLike: false,
            date: status.time,
            user_name: user.name,
            user_image: user.avatar,
            isEdite: true,
            isDelete: true
        }))
    })
    // .catch(err => {
    //     return res.end(JSON.stringify({
    //         success : false
    //     }))
    // })
})

status.post('/like/:status_id', (req, res) =>{
    let { status_id } = req.params
    let user_id = req.session.passport.user
    // console.log(status_id)
    Status.findOne( { _id : status_id } )
    .then(status => {
        // console.log(status)
        if ( status.like.includes(user_id) ){
            let index = status.like.indexOf(user_id)
            status.like.splice(index, 1)
            Status.updateOne( { _id : status._id },
                              { like : status.like } )
            .then(result => {
                return res.end(JSON.stringify({ isLiked : false ,
                                                status_id : status._id }))
            })
            .catch(err => {
                return res.end(JSON.stringify( { err_code : 100 } ))
            })
        }
        else {
            status.like.push (user_id)
            Status.updateOne( { _id : status._id },
                              { like : status.like } )
            .then(result => {
                return res.end(JSON.stringify({ isLiked : true ,
                                                status_id : status._id }))
            })
            .catch(err => {
                return res.end(JSON.stringify( { err_code : 100 } ))
            })
        }
    })
    .catch (err => {
        return res.end(JSON.stringify( { err_code : 100 } ))
    })
})

module.exports = status