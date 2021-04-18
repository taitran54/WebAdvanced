require('dotenv').config()

const express = require('express')
const register = express.Router()
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const passport = require('passport')
const User = require('../models/user')

register.use(bodyParser.urlencoded({extended: false}))

// passport.serializeUser(function(user, done) {
//     // console.log("Serialize: ",user)
//     done(null, user._id);
// });

// passport.deserializeUser((id, done) => {
//     User.findById(id)
//         .then(user => {
//             // console.log("Serialize: ",user)
//             done(null, user)
//         })
//         .catch(err => done(err, null));
// })

register.get('/', (req, res) => {
    return res.render('register')
})

register.post('/', (req, res) => {
    let { name, password, role} = req.body
    let hashed = bcrypt.hashSync(password, 10)
    let user = new User({
        name: name,
        password: hashed,
        role: role,
        created: new Date(), 
    }).save()

    .then((value) => {
        console.log(value)
        return res.redirect('/login')
    })
    .catch((err) => console.log(err))
})
module.exports = register