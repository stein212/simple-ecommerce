// http://www.passportjs.org/docs/configure/
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const dataAccess = require('../data')

passport.use(
    new LocalStrategy(function(username, password, done) {
        dataAccess.users
            .getUserByUsername(username)
            .then(async function(user) {
                const isCorrect = await dataAccess.users.checkPassword(
                    password,
                    user.password
                )

                if (!isCorrect) {
                    return done(null, false, { message: 'Invalid password' })
                }

                return done(null, {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.discriminator,
                })
            })
            .catch(function(err) {
                return done(null, false, { message: 'Invalid username' })
            })
    })
)

passport.serializeUser(function(user, done) {
    return done(null, user)
})

passport.deserializeUser(function(user, done) {
    return done(null, user)
})
