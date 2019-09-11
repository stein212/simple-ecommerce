const homeController = require('./homeController')
const sellerController = require('./sellerController')

const controllers = {
    init(app) {
        homeController.init(app)
        sellerController.init(app)
    },
}

module.exports = controllers
