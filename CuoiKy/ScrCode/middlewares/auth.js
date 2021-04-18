module.exports = (req, res, next) => {
  // console.log('User: ', req.user.role)  
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
}