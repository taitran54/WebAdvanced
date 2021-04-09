require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()

const auth = require('./middlewares/auth')

const loginRouter = require('./controller/login')
const mainRouter = require('./controller/main')

const PORT = process.env.PORT || 8080

const mongoose = require('./db')

app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine','ejs')

app.use('/public', express.static(path.join(__dirname, 'public')))

app.use('/login', loginRouter)
app.use('/test', auth, mainRouter) //test middleware use for a Router

app.get('/', (req, res) => {
    return res.json({'code': 404, 'msg': 'Router not found'})
})

app.listen(PORT, () => {
    console.log(`Server is runing on http://localhost:${PORT}`)
})

mongoose.connect()