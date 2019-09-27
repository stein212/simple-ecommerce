const dataAccess = require('../data')

const homeController = {
    init(app) {
        app.get('/', function(req, res) {
            // getAllProducts returns a js promise
            dataAccess.products
                .getAllProducts()
                // once the promise is done getting the data, 'then' do the function
                .then(function(data) {
                    // make a string representation of the data
                    let products = JSON.stringify(data)

                    // pass the `products` into the view
                    res.render('home/index', { title: 'Products', products })
                })
        })

        // :id allows the route to know that the string after '/viewProduct/' is a variable
        // then allowing us to use it via 'req.params.id'
        app.get('/viewProduct/:id', function(req, res) {
            dataAccess.products
                .getProduct(req.params.id)
                .then(function(product) {
                    res.render('home/viewProduct', {
                        title: product.name,
                        product,
                    })
                })
        })
    },
}

module.exports = homeController
