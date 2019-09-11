const express = require('express')

const app = express()

const port = 3000

// http://localhost:3000
app.get('/', function(req, res) {
    res.send('<h1>Hello World</h1>')
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})
