const express = require('express')
const logout = express.Router()

logout.get('/', function(req, res){
    // console.log('Before: ',req.session)
    req.logout();
    // console.log('After: ', req.session)
    res.redirect('/login');
});

module.exports = logout