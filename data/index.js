const mysql = require('mysql2')
const uuid = require('uuid/v4')

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'seuser',
    password: process.env.MysqlPassword,
    database: 'se_1',
})

const localData = require('./productData.json')

const dataAccess = {
    // async getAllProducts() {
    //     return new Promise(function(resolve, reject) {
    //         resolve(localData)
    //     })
    // },
    getAllProducts() {
        return new Promise(function(resolve, reject) {
            pool.query('SELECT * FROM Products', function(
                error,
                results,
                fields
            ) {
                if (error) reject(error)

                resolve(results)
            })
        })
    },
    getProduct(id) {
        return new Promise(function(resolve, reject) {
            pool.query('SELECT * FROM Products', function(
                error,
                results,
                fields
            ) {
                if (results.length < 1) reject('No such product')

                resolve(results[0])
            })
        })
    },
    addProduct({ name, price }) {
        return new Promise(function(resolve, reject) {
            let id = uuid()
            pool.query(
                'INSERT INTO Products Values (?, ?, ?)',
                [uuid(), name, price],
                function(err, results, fields) {
                    if (err) reject(err)

                    resolve({ id, name, price })
                }
            )
        })
    },
    editProduct({ id, name, price }) {
        return new Promise(function(resolve, reject) {
            pool.query(
                `UPDATE Products
                SET name = ?, price = ?
                WHERE id = ?`,
                [name, price, id],
                function(err, results, fields) {
                    if (err) reject(err)

                    resolve({ id, name, price })
                }
            )
        })
    },
    deleteProduct(id) {
        return new Promise(function(resolve, reject) {
            pool.query(
                `DELETE FROM Products
                WHERE id = ?`,
                [id],
                function(err, results, fields) {
                    if (err) reject(err)

                    resolve(true)
                }
            )
        })
    },
}

module.exports = dataAccess
