const dataAccess = require('../data')

const accountController = {
    init(app) {
        app.get('/account/login', function(req, res) {
            res.render('account/login')
        })

        app.post('/account/login', function(req, res) {
            dataAccess.users
                .checkCredentials(req.body.username, req.body.password)
                .then(function(isValid) {
                    if (isValid) {
                        res.redirect('/seller')
                        return
                    }

                    res.render('account/login')
                })
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
