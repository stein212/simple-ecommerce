const mysql = require('mysql2')
const uuid = require('uuid/v4')

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
    getProduct(id) {
        return new Promise(function(resolve, reject) {
            pool.query(
                `SELECT * FROM products
                WHERE id = ?`,
                [id],
                function(err, results) {
                    // if has error or no product by that `id`
                    if (err || results.length < 1) {
                        reject(`No product by id: ${id}`)
                        return
                    }

                    resolve(results[0])
                }
            )
        })
    },
    addProduct(name, price) {
        return new Promise(function(resolve, reject) {
            let productId = uuid()
            pool.query(
                `INSERT INTO products
                VALUES
                (?, ?, ?)`,
                [productId, name, price],
                function(err) {
                    if (err) {
                        reject(err)
                        return
                    }

                    resolve(productId)
                }
            )
        })
    },
}

module.exports = dataAccess
