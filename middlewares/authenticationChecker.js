const routesWhitelist = require('../routes-whitelist')

module.exports = function authenticationChecker(req, res, next) {
    console.log(req.user)
    if (
        routesWhitelist.includes(req._parsedOriginalUrl.pathname) ||
        req.user !== undefined
    ) {
        return next()
    }
    res.redirect('/Account/Login')
}
