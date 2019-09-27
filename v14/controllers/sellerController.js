const dataAccess = require('../data')

const sellerController = {
    init(app) {
        app.get('/seller', function(req, res) {
            dataAccess.products
                .getProductsBySellerId(req.user.id)
                .then(function(products) {
                    products = JSON.stringify(products)
                    res.render('seller/index', { products })
                })
        })

        app.get('/seller/viewProduct/:id', function(req, res) {
            dataAccess.products
                .getProduct(req.params.id)
                .then(function(product) {
                    res.render('seller/viewProduct', {
                        title: product.name,
                        product,
                    })
                })
        })

        app.get('/seller/addProduct', function(req, res) {
            res.render('seller/addProduct', { title: 'Add Product' })
        })

        app.post('/seller/addProduct', function(req, res) {
            // req.body refers to the body of the request (requests have a header and body)
            dataAccess.products
                .addProduct(req.user.id, req.body.name, req.body.price)
                .then(function(id) {
                    res.redirect(`/seller/viewProduct/${id}`)
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
                .editProduct(
                    req.user.id,
                    req.params.id,
                    req.body.name,
                    req.body.price
                )
                .then(function(isEdited) {
                    res.redirect(`/seller/viewProduct/${req.params.id}`)
                })
        })

        app.post('/seller/deleteProduct/:id', function(req, res) {
            dataAccess.products
                .deleteProduct(req.user.id, req.params.id)
                .then(function(isDeleted) {
                    res.redirect('/seller')
                })
        })
    },
}

module.exports = sellerController