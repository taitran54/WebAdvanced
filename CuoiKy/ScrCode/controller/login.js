require('dotenv').config()

const express = require('express');
const login = express.Router()
const passport = require('passport')
const uuid = require('uuid')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const LocalStrategy = require('passport-local').Strategy
// const { CLIENT_SECRET, CLIENT_ID } = process.env

const User = require('../models/user')

// login.use(passport.initialize());

login.use(bodyParser.urlencoded({extended: false}))

login.get('/', function (req, res) {
    // console.log(req.session)
    return res.render('login', { login_errors: req.session.messages || [] }); // load the login page
});

login.post('/', 
  passport.authenticate('local', { successRedirect:'/home',
                                   failureRedirect: '/login' , 
                                   failureMessage: "Invalid username or password"}),
  function(req, res) {
    res.redirect('/test');
});

passport.use(new LocalStrategy(
    (username, password, done) => {
        // console.log('Account: ', username, password)
        //match user
        User.findOne({name : username})
        .then((user)=>{
            if(!user) {
                return done(null,false,{message : 'that email is not registered'});
            }
            console.log(user.password)
            //match pass
            bcrypt.compare(password,user.password,(err,isMatch)=>{
                if(err) throw err;

                if(isMatch) {
                    // req.flash('success_msg','You have now registered!')
                    return done(null,user);
                } else {
                    // req.flash('success_msg','You have now registered!')
                    return done(null,false,{message : 'pass incorrect'});
                }
            })
        })
        .catch((err)=> {console.log(err)})
    })
)

passport.serializeUser(function(user, done) {
    // console.log("Serialize: ",user)
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => {
            // console.log("Serialize: ",user)
            done(null, user)
        })
        .catch(err => done(err, null));
})


passport.use(new GoogleStrategy({
    clientID: '914718534273-867f2hk89t9lo8ejtknedrg543ajoobk.apps.googleusercontent.com',
    clientSecret: 'ybUObMp-TnYRNSx_SV30i0id',
    callbackURL: "http://localhost:8080/login/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        const authId = 'google:' + profile.id;
        // console.log(profile._json.email)
        const email = profile._json.email
        // const email = '518H0560@student.tdtu.edu.vn'
        const pattern =  /(.*@student\.tdtu\.edu\.vn|.*@tdtu\.edu\.vn)$/i
        if (!email.match(pattern)){
            return done(null , null)
        }
        User.findOne({ 'authId': authId })
        .then(user => {
            if(user) return done(null, user);
            // console.log(profile)
            new User({
                authId: authId,
                name: profile.displayName,
                email: profile._json.email,
                created: new Date(),
                role: 'student',
                avatar: './public/uploads/avatar/default.png'
            }).save()
            .then(user => done(null, user))
            .catch(err => done(err, null));
        })
        .catch(err => {
            if(err) return done(err, null);
        });
    }
));

login.get('/auth/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login',
                                              'https://www.googleapis.com/auth/userinfo.email'] })
)

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
login.get('/auth/google/callback', 
    passport.authenticate('google', { successRedirect:'/home',
                                      failureRedirect: '/login',
                                      failureMessage: "Invalid google account" }),
    // function(req, res) {
    //     res.redirect('/test');
    // }
)

module.exports = login