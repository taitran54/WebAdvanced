// This router just write for test

const express = require ('express')
const main = express.Router()
const status = require ('../models/status')
const comment = require ('../models/comment')

main.get('/', (req, res) => {
    return res.end(`Test`)
})

module.exports = main