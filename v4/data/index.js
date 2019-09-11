const mysql = require('mysql2')

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: process.env.MysqlUser, // replace with your own user and password
    password: process.env.MysqlPassword,
    database: 'se_1',
})

const dataAccess = {
    getAllProducts() {
        return new Promise(function(resolve, reject) {
            pool.query('SELECT * FROM products', function(err, results) {
                if (err) {
                    reject(err)
                    return
                }

                resolve(results)
            })
        })
    },
}

module.exports = dataAccess
