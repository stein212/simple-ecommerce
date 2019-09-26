const dataAccess = require('../data')
const passport = require('passport')

const accountController = {
    init(app) {
        app.get('/account/login', function(req, res) {
            res.render('account/login')
        })

        app.post(
            '/account/login',
            // add this so that passport can handle adding user to session for us
            passport.authenticate('local', {
                failureRedirect: '/account/login',
            }),
            function(req, res) {
                switch (req.user.role) {
                    case 'seller':
                        res.redirect('/seller')
                        break
                    case 'buyer':
                        res.redirect('/buyer')
                        break
                    default:
                        console.log('No role in user')
                        res.redirect('/account/login')
                }
            }
        )

        app.post('/account/logout', function(req, res) {
            req.logout()
            res.redirect('/')
        })

        app.get('/account/registerSeller', function(req, res) {
            res.render('account/registerSeller')
        })

        app.post('/account/registerSeller', function(req, res) {
            dataAccess.users
                .registerSeller(
                    req.body.email,
                    req.body.username,
                    req.body.password,
                    req.body.firstName,
                    req.body.lastName,
                    req.body.dob,
                    req.body.shopName
                )
                .then(function(sellerId) {
                    res.redirect('/account/login')
                })
                .catch(function(err) {
                    res.render('account/registerSeller')
                })
        })
    },
}

module.exports = accountController
