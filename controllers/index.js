const homeController = require('./homeController')

controllers = {
    init(app) {
        homeController.init(app)
    },
}

module.exports = controllers
