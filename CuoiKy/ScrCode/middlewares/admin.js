module.exports = (req, res, next) => {
    // console.log('User: ', req.user.role)  
    if (req.isAuthenticated())
        if (req.user.role == 'admin')
            return next();
    req.session.messages = ['Request admin permissions']
    res.redirect('/login');
}