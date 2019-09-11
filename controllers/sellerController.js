const dataAccess = require('../data')
const passportAuth = require('../passport').passportAuth

const sellerController = {
    init(app) {
        app.get('/seller', async function(req, res) {
            let products

            try {
                products = await dataAccess.products.getSellerProducts(
                    req.user.id
                )
                products = JSON.stringify(products)
            } catch (err) {
                console.log(err)
            }

            res.render('seller/index', {
                layout: 'default',
                title: 'Dashboard',
                products,
            })
        })

        app.get('/Seller/ViewProduct/:id', async function(req, res) {
            let product

            try {
                product = await dataAccess.products.getProduct(req.params.id)
            } catch (err) {
                console.log(err)
            }

            res.render('seller/viewProduct', {
                layout: 'default',
                title: product.name,
                product,
            })
        })

        app.route('/Seller/AddProduct')
            .get(function(req, res) {
                res.render('seller/addProduct', {
                    layout: 'default',
                    title: 'Add Product',
                })
            })
            .post(async function(req, res) {
                let product = (({ name, price }) => ({
                    name,
                    price,
                }))(req.body)

                product.sellerId = req.user.id

                try {
                    addedProduct = await dataAccess.products.addProduct(product)
                } catch (err) {
                    console.log(err)
                }

                res.redirect('/Seller')
            })

        app.get('/Seller/EditProduct/:id', async function(req, res) {
            let product

            try {
                product = await dataAccess.products.getProduct(req.params.id)
            } catch (err) {
                console.log(err)
            }

            res.render('seller/editProduct', {
                layout: 'default',
                title: 'Edit Product',
                id: product.id,
                name: product.name,
                price: product.price,
            })
        })

        app.post('/Seller/EditProduct/:id', async function(req, res) {
            let editedProduct
            try {
                let product = req.body
                product.id = req.params.id
                product.sellerId = req.user.id

                editedProduct = await dataAccess.products.editProduct(product)
            } catch (err) {
                console.log(err)
            }

            res.redirect(`/Seller/ViewProduct/${req.params.id}`)
        })

        app.post('/Seller/DeleteProduct/:id', async function(req, res) {
            try {
                await dataAccess.products.deleteProduct(
                    req.params.id,
                    req.user.id
                )
            } catch (err) {
                console.log(err)
            }

            res.redirect('/Seller')
        })
    },
}

module.exports = sellerController
