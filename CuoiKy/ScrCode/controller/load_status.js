require('dotenv').config()

const express = require('express');
const loadStatus = express.Router()

const Status = require('../models/status')
const User = require ('../models/user')
const Comment = require('../models/comment');
const { model } = require('mongoose');

loadStatus.post('/', async (req, res) => {
    user_id = req.session.passport.user
    console.log(  req.session.status_filter )
    let status = await Status.find( req.session.status_filter ).sort({ 'time' : 1})
    let isAd = isAdmin(user_id)
    let user = await User.findOne( {_id :user_id })
    .then (user => {
        return user
    }).catch (err => {
        return err
    })

    var count = 0
    var index = 0
    console.log(status.length)

    var result = new Object()
    result.status = []

    while ((index < status.length) && (count < 10)) {
        
        if (req.session.render_status_id.includes(status[index]._id)){
            index += 1
        } else {
            // console.log(status[count]._id)
            req.session.render_status_id.push(status[count]._id)

            var status_obj = new Object()
            if ( status[index].like !== 'undefined'){
                var boo = status[index].like.includes(user_id)
            }
            else {
                var boo = false
            }
            var user_status =  await User.findOne( {_id : status[index].user_post })
            .then (user => {
                return user
            }).catch (err => {
                return err
            })

            isDelete = false
            isEdit = false
            if (isAd || user_status._id == user_id){
                isDelete = true
                isEdit = true
            }

            status_obj.status_id = status[index]._id
            status_obj.isEdit = isEdit
            status_obj.isDelete = isDelete
            status_obj.content = status[index].content
            status_obj.date = status[index].time
            // status_obj.user_post = status[index].user_post
            status_obj.number_like = status[index].like.length
            status_obj.isLike = boo
            status_obj.comments = await get_comment_array(status[index]._id, user_id)
            status_obj.user_name = user_status.name
            status_obj.user_id = user_status._id
            status_obj.user_image = user_status.avatar

            result.status.push(status_obj)
            count += 1
            index += 1
        }
    }
    // console.log(req.session.render_status_id)
    // console.log (user)
    
    result.user_name = user.name
    result.user_id = user._id
    result.avatar_image = user.avatar
    result.success = true
    // console.log(result)
    return res.end(JSON.stringify(result))

    
})

async function get_comment_array(status_id, user_id){
    var result = []
    // user_id = req.session.passport.user

    let comment = await Comment.find({ status_parent : status_id }).sort({ time: 1 })
    var isAd = isAdmin(user_id)
    var i
    for (i = 0; i < comment.length; ++i ) {
        var comment_obj = new Object()
        var user_cmt = await User.findOne({_id : comment[i].user_comment } ).then (user => {
            return user
        }).catch(err => {
            return err
        })
        var boo = false
        if (user_id == user_cmt._id || isAd){
            var boo = true
        }
        comment_obj.comment_id = comment[i]._id
        comment_obj.comment_content = comment[i].content
        comment_obj.date_comment = comment[i].time
        comment_obj.isDelete = boo
        comment_obj.comment_user_id = user_cmt._id
        comment_obj.comment_user_name = user_cmt.name
        comment_obj.commet_user_image = user_cmt.avatar
        
        result.push(comment_obj)
    }
    return result
}

function isAdmin (user_id) {
    User.findOne({'_id' : user_id})
    .then(user => {
        if (user.role == 'Admin') {
            return true
        }
        return false
    }).catch(err => {
        return false
    })
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

module.exports = loadStatus