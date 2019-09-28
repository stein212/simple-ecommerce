const dataAccess = require('../data')

const buyerController = {
    init(app) {
        app.get('/buyer/cart', function(req, res) {
            dataAccess.cartItems
                .getBuyerCartItems(req.user.id)
                .then(function(cartItems) {
                    cartItems = JSON.stringify(cartItems)

                    res.render('buyer/cart', { title: 'Cart', cartItems })
                })
        })

        app.post('/buyer/addToCart', function(req, res) {
            dataAccess.cartItems
                .addToCart(req.user.id, req.body.productId, +req.body.quantity)
                .then(function(newQuantity) {
                    res.redirect('/buyer/cart')
                })
        })
    },
}

module.exports = buyerController
