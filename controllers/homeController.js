const dataAccess = require('../data')

const homeController = {
    init(app) {
        app.get('/', async function(req, res) {
            let products

            try {
                products = await dataAccess.products.getAllProducts()

                products = JSON.stringify(products)
            } catch (err) {
                console.log(err)
            }

            res.render('home/index', {
                layout: 'default',
                title: 'SE',
                products,
            })
        })

        app.get('/ViewProduct/:id', async function(req, res) {
            let product

            try {
                product = await dataAccess.products.getProduct(req.params.id)
            } catch (err) {
                console.log(err)
            }

            res.render('home/viewProduct', {
                layout: 'default',
                title: product.name,
                product,
            })
        })

        app.route('/AddProduct')
            .get(function(req, res) {
                res.render('home/addProduct', {
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

                res.redirect('/')
            })

        app.get('/EditProduct/:id', async function(req, res) {
            let product

            try {
                product = await dataAccess.products.getProduct(req.params.id)
            } catch (err) {
                console.log(err)
            }

            res.render('home/editProduct', {
                layout: 'default',
                title: 'Edit Product',
                id: product.id,
                name: product.name,
                price: product.price,
            })
        })

        app.post('/EditProduct/:id', async function(req, res) {
            let editedProduct
            try {
                let product = req.body
                product.id = req.params.id
                editedProduct = await dataAccess.products.editProduct(product)
            } catch (err) {
                console.log(err)
            }

            res.redirect(`/ViewProduct/${req.params.id}`)
        })

        app.post('/DeleteProduct/:id', async function(req, res) {
            try {
                await dataAccess.products.deleteProduct(req.params.id)
            } catch (err) {
                console.log(err)
            }

            res.redirect('/')
        })
    },
}

module.exports = homeController
