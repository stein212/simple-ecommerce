const routesWhitelist = [
    '/',
    '/account/login',
    '/account/registerSeller',
    '/account/registerBuyer',
]

const homePrefix = '/home'
const sellerPrefix = '/seller'
const buyerPrefix = '/buyer'

function authorizer(req, res, next) {
    if (routesWhitelist.includes(req._parsedOriginalUrl.pathname)) {
        next()
    } else if (req._parsedOriginalUrl.pathname.indexOf(sellerPrefix) === 0) {
        if (req.user === undefined) {
            res.status(401)

            res.render('401')
        } else if (req.user.role === 'seller') {
            next()
        } else {
            res.status(403)

            res.render('403')
        }
    } else if (req._parsedOriginalUrl.pathname.indexOf(buyerPrefix) === 0) {
        if (req.user === undefined) {
            res.status(401)

            res.render('401')
        } else if (req.user.role === 'buyer') {
            next()
        } else {
            res.status(403)

            res.render('403')
        }
    } else {
        next()
    }
}

module.exports = authorizer
