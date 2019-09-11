const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const controllers = require('./controllers')

const app = express()

const port = 3000

const hbs = exphbs.create({
    extname: 'hbs', // file extension to be .hbs
    helpers: {
        // allows for sectioning (see main.hbs layout and the other normal views)
        section(name, options) {
            if (!this._sections) this._sections = {}
            this._sections[name] = options.fn(this)
            return null
        },
    },
})

// name the engine hbs
app.engine('hbs', hbs.engine)
// set the 'view engine' to the named engine
app.set('view engine', 'hbs')

// body-parser is to allow us to get data from form posts
app.use(bodyParser.urlencoded({ extended: true }))

controllers.init(app)

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})
