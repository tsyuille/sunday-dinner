const express = require('express')
const app = express()
const mongoose = require('mongoose')
const passport = require('passport')
const bodyParser = require('body-parser')
const expressLayouts = require('express-ejs-layouts')
const fileUpload = require('express-fileupload')
const session = require('express-session')
// const MongoStore = require('connect-mongo')(session)
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')

const port = process.env.PORT || 9000

require('dotenv').config()
require('./config/passport')(passport)

app.use(express.urlencoded( {extended: true} ))
app.use(express.json())
app.use(express.static('public'))
app.use(expressLayouts)

app.use(cookieParser('CookingBlogSecure'))
app.use(methodOverride('_method'))
app.use(session({
  secret: 'CookingBlogSecretSession',
  saveUninitialized: false,
  resave: false
  // store: new MongoStore({ mongooseConnection: mongoose.connection})
})
)

app.use(flash())
app.use(fileUpload())
app.use(bodyParser.urlencoded({ extended: true }))


app.use(passport.initialize())
app.use(passport.session())

// app.use(logger('dev'))

// app.use(methodOverride('_method'))

app.set('layout', './layout/main')
app.set('view engine', 'ejs')

const routes = require('./server/routes/recipeRoutes.js')
app.use('/', routes);
app.listen(port, () => console.log(`Listening to port ${port}`))