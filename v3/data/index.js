const localData = require('./productData.json')

const dataAccess = {
    getAllProducts() {
        return new Promise(function(resolve, reject) {
            resolve(localData)
        })
    },
}

module.exports = dataAccess
