const dataAccess = require('../data')

const sellerController = {
    init(app) {
        app.get('/seller', function(req, res) {
            res.render('seller/index')
        })

        app.get('/seller/addProduct', function(req, res) {
            res.render('seller/addProduct', { title: 'Add Product' })
        })

        app.post('/seller/addProduct', function(req, res) {
            // req.body refers to the body of the request (requests have a header and body)
            dataAccess.products
                .addProduct(req.body.name, req.body.price)
                .then(function(id) {
                    res.redirect(`/viewProduct/${id}`)
                })
        })

        app.get('/seller/editProduct/:id', function(req, res) {
            dataAccess.products
                .getProduct(req.params.id)
                .then(function(product) {
                    res.render('seller/editProduct', {
                        title: 'editProduct',
                        product,
                    })
                })
        })

        app.post('/seller/editProduct/:id', function(req, res) {
            // req.body refers to the body of the request (requests have a header and body)
            dataAccess.products
                .editProduct(req.params.id, req.body.name, req.body.price)
                .then(function(isEdited) {
                    res.redirect(`/viewProduct/${req.params.id}`)
                })
        })

        app.post('/seller/deleteProduct/:id', function(req, res) {
            dataAccess.products
                .deleteProduct(req.params.id)
                .then(function(isDeleted) {
                    res.redirect('/')
                })
        })
    },
}

module.exports = sellerController
