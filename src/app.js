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
app.use((req,res,next) => {
    const error = new Error('Not found')
    error.status = 404
    next(error)
})

app.use((error, req,res,next) => {
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        error: error.message
    })

})

module.exports = app