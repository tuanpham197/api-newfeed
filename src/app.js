const compression = require('compression')
const express = require('express')
const { default: helmet } = require('helmet')
const app = express()

const morgan = require('morgan')

// init middleware
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

// init db
require('./dbs/init.mongodb')

// check overload connect
// const { checkOverload } = require('./helpers/check.connect')
// checkOverload()

// init router
app.use('', require('./routes'))

// handling error

module.exports = app