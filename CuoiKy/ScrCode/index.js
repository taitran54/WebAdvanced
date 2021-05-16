require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()
const passport = require('passport')
const flash = require('connect-flash')

//Set middleware
const auth = require('./middlewares/auth')
const requesAdmin = require('./middlewares/admin')
const clearSession = require('./middlewares/clearsession')

//Set Router
const loginRouter = require('./controller/login')
const mainRouter = require('./controller/main')
const logoutRouter = require('./controller/logout')
const registerRouter = require('./controller/register')
const homePage = require('./controller/home')
const statusRoute = require('./controller/status')
const loadStatus = require('./controller/load_status')
const comment = require('./controller/comment')
const notifications = require('./controller/notification')
const resetpassword = require('./controller/resetpassword')

const PORT = process.env.PORT || 8080

const mongoose = require('./db')

// Start set middleware
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine','ejs')

app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}));

app.use(passport.initialize()) //Using to repare for passport
app.use(passport.session());
app.use(clearSession)

//Set static file ex: css, js for client request
app.use('/public', express.static(path.join(__dirname, 'public')))
//End set middleware

//set path for Router
app.use('/login',passport.initialize(), loginRouter)
app.use('/logout', auth, logoutRouter)
app.use('/home', auth, homePage)
app.use('/status', auth, statusRoute)
app.use('/register'
// , requesAdmin 
    ,registerRouter)
app.use('/load_status', auth, loadStatus)
app.use('/comment',auth, comment)
app.use('/notification', auth, notifications)
app.use('/resetpassword', auth, resetpassword)
app.use('/test', auth, mainRouter) //test middleware use for a Router

app.get('/', (req, res) => {
    return res.redirect('./login')
})

app.get('[\d\w\/]', (req, res) => {
    return res.end(JSON.stringify({code: 404, message: "Not found"}))
})

app.listen(PORT, () => {
    console.log(`Server is runing on http://localhost:${PORT}`)
})

mongoose.connect()