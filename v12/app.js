const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const controllers = require('./controllers')
const session = require('express-session')
const passport = require('passport')

// load passport configurationn
require('./passport')

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

// enable sessions
app.use(
    session({
        secret: process.env.CookiePassword,
        cookie: { httpOnly: true },
        name: 'se_identity',
        resave: true,
        saveUninitialized: false,
    })
)

// body-parser is to allow us to get data from form posts
app.use(bodyParser.urlencoded({ extended: true }))

// Add passport middleware so that it can do auth for each request
app.use(passport.initialize())
app.use(passport.session())

app.use(require('./middlewares/authorizer'))

// pass user so that handlebars template can use
app.use(function(req, res, next) {
    res.locals.user = req.user
    next()
})

// we abstract the routes into their respective controllers (views also changed)
controllers.init(app)

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})
