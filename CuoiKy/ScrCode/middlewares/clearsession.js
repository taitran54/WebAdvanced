module.exports = (req, res, next) => {
    if (typeof req.session.messages !== 'undefined'){
        while (req.session.messages.length > 1) {
            req.session.messages.shift()
        }
    }
    return next()
}