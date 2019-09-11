const dataAccess = require('../data')
const passport = require('passport')

const accountController = {
    init(app) {
        app.get('/Account/Login', function(req, res) {
            res.render('account/login', {
                layout: 'default',
                title: 'Login',
            })
        })

        app.post(
            '/Account/Login',
            passport.authenticate('local', {
                failureRedirect: '/Account/Login',
            }),
            function(req, res) {
                switch (req.user.role) {
                    case 'buyer':
                        res.redirect('/Buyer')
                        break
                    case 'seller':
                        res.redirect('/Seller')
                        break
                    default:
                    // handle invalid role
                }
            }
        )

        app.get('/Account/RegisterSeller', function(req, res) {
            res.render('account/registerSeller', {
                layout: 'default',
                title: 'Seller Registration',
            })
        })

        app.post('/Account/RegisterSeller', async function(req, res) {
            let sellerId = await dataAccess.users.registerSeller(req.body)

            res.redirect('/Account/Login')
        })

        app.get('/Account/RegisterBuyer', function(req, res) {
            res.render('account/registerBuyer', {
                layout: 'default',
                title: 'Buyer Registration',
            })
        })

        app.post('/Account/RegisterBuyer', async function(req, res) {
            let buyerId = await dataAccess.users.registerBuyer(req.body)

            res.redirect('/Account/Login')
        })
    },
}

module.exports = accountController
