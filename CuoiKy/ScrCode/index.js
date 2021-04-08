require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()

const PORT = process.env.PORT || 8080

app.use(bodyParser.urlencoded({extended: true}))

app.use('/public', express.static(path.join(__dirname, 'public')))

app.listen(PORT, () => {
    console.log(`Server is runing on http://localhost:${PORT}`)
})