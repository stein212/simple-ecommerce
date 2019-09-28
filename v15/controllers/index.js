const homeController = require('./homeController')
const accountController = require('./accountController')
const sellerController = require('./sellerController')
const buyerController = require('./buyerController')

const controllers = {
    init(app) {
        homeController.init(app)
        accountController.init(app)
        sellerController.init(app)
        buyerController.init(app)
    },
}

module.exports = controllers
