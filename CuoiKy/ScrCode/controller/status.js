require('dotenv').config()

const express = require('express');
const status = express.Router()

const Status = require('../models/status')
const User = require ('../models/user')
const Comment = require('../models/comment');
// const { compare } = require('bcrypt');

status.get('/',(req, res) => {
    user_id = req.session.passport.user
    req.session.status_filter = new Object()
    req.session.status_filter = { user_post: user_id }
    User.findOne( { _id : user_id } )
        .then (async user => {
            let status = await Status.find( { user_post: user_id } ).sort({ time: -1 })
            // console.log(status)
            var count = 0
            req.session.render_status_id = []
            console.log(status.length)

            var result = new Object()
            result.status = []

            while ((count < status.length) && (count < 10)) {
                
                // console.log(status[count]._id)
                req.session.render_status_id.push(status[count]._id)

                var status_obj = new Object()
                if ( status[count].like !== 'undefined'){
                    var boo = status[count].like.includes(user_id)
                }
                else {
                    var boo = false
                }

                status_obj._id = status[count]._id
                status_obj.isEdit = true
                status_obj.isDelete = true
                status_obj.content = status[count].content
                status_obj.time = get_text_from_date(status[count].time)
                status_obj.user_post = status[count].user_post
                status_obj.like = status[count].like.length
                status_obj.isLike = boo
                status_obj.comments = await get_comment_array(status[count]._id, user_id)
                status_obj.user_name = user.name
                status_obj.user_id = user._id
                status_obj.avatar_image = user.avatar

                result.status.push(status_obj)
                count += 1
            }
            // console.log(req.session.render_status_id)
            // console.log (user)
            
            result.user_name = user.name
            result.user_id = user._id
            result.avatar_image = user.avatar
            // console.log(result)
            return res.render('index', result)
        })
})

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
            comments: [],
            isLike: false,
            date: status.time,
            user_name: user.name,
            user_image: user.avatar,
            number_like: status.like.length,
            user_id: user._id,
            isEdit: true,
            isDelete: true
        }))
    })
    .catch(err => {
        return res.end(JSON.stringify({
            success : false
        }))
    })
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

status.post('/comment/:status_id', (req, res) => {
    let { status_id } = req.params
    let { cmt_content } = req.body 
    user_id = req.session.passport.user

    new Comment ({
        content: cmt_content,
        time: new Date(),
        user_comment: user_id,
        status_parent: status_id
    }).save()
    .then(async (comment) => {

        let user = await User.findOne({ '_id' : user_id })
        .then(user => {
            return user
        })
        .catch(err => {
            return err
        })

        return res.end(JSON.stringify({
            success: true,
            comment_user_name: user.name,
            comment_content: comment.content,
            comment_id: comment._id,
            isDelete: true,
            commet_user_image: user.avatar,
            date_comment: comment.time
        }))
    })
    .catch(err => {
        console.log("ERROR in status Router:",err)
        return res.end(JSON.stringify({
            success : false
        }))
    })
})

async function get_comment_array(status_id, user_id){
    var result = []
    // user_id = req.session.passport.user

    let comment = await Comment.find({ status_parent : status_id }).sort({ time: 1 })

    var i
    for (i = 0; i < comment.length; ++i ) {
        var comment_obj = new Object()
        var user_cmt = await User.findOne({_id : comment[i].user_comment } ).then (user => {
            return user
        }).catch(err => {
            return err
        })
        var boo = false
        if (user_id == user_cmt._id){
            var boo = true
        }
        comment_obj._id = comment[i]._id
        comment_obj.content = comment[i].content
        comment_obj.time = get_text_from_date(comment[i].time)
        comment_obj.isDelete = boo
        comment_obj.comment_user_id = user_cmt._id
        comment_obj.comment_user_name = user_cmt.name
        comment_obj.comment_user_avatar = user_cmt.avatar
        
        result.push(comment_obj)
    }
    return result
}

function get_text_from_date(date){
    var post_date = new Date(date)
    // console.log(post_date)
    var diff = Math.abs(new Date() - post_date)
    // console.log(diff)
    // console.log(msToTime(diff))
    return msToTime(diff) + ' ago'
}

function msToTime(ms) {
    let seconds = (ms / 1000).toFixed(0);
    let minutes = (ms / (1000 * 60)).toFixed(0);
    let hours = (ms / (1000 * 60 * 60)).toFixed(0);
    let days = (ms / (1000 * 60 * 60 * 24)).toFixed(0);
    if (seconds < 60) return seconds + " seconds";
    else if (minutes < 60) return minutes + " minutes";
    else if (hours < 24) return hours + " hours";
    else return days + " days"
}


module.exports = status