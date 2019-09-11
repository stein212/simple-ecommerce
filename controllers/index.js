const homeController = require('./homeController')
const accountController = require('./accountController')
const sellerController = require('./sellerController')
const buyerController = require('./buyerController')
const buyerApiController = require('./buyerApiController')

controllers = {
    init(app) {
        homeController.init(app)
        accountController.init(app)
        sellerController.init(app)
        buyerController.init(app)

        buyerApiController.init(app)
    },
}

module.exports = controllers
