// This router just write for test

const express = require ('express')
const main = express.Router()

main.get('/', (req, res) => {
    return res.end(`Test`)
})

module.exports = main