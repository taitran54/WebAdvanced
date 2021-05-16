require('dotenv').config()

const express = require('express')
const comment = express.Router()

const Status = require('../models/status')
const User = require ('../models/user')
const Comment = require('../models/comment');
const { model } = require('mongoose')

comment.delete('/:comment_id', (req, res) => {
    
    let { comment_id } = req.params
    // console.log(comment_id)
    Comment.deleteOne( { _id: comment_id} )
    .then (cmt => {
        // console.log(cmt)
        return res.end(JSON.stringify({ success: true }))
    }).catch(err => {
        // console.log(err)
        return res.end(JSON.stringify({ success: false }))
    })
})

module.exports = comment