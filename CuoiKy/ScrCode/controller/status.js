require('dotenv').config()

const express = require('express');
const status = express.Router()

status.post('/', (req, res) => {
    let { content } = req.body
    console.log(content)
    console.log(req.session.passport.user)
    
})

module.exports = status