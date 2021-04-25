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
app.use('/register', registerRouter)
app.use('/test', auth, mainRouter) //test middleware use for a Router

app.get('/', (req, res) => {
    return res.json({'code': 404, 'msg': 'Router not found'})
})

app.listen(PORT, () => {
    console.log(`Server is runing on http://localhost:${PORT}`)
})

mongoose.connect()