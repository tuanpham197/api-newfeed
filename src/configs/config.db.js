'use strict'

const dev = {
    app: {
        port: process.env.PORT || 3035
    },
    db: {
        user: process.env.DB_USER,
        pass: process.env.DB_PASS,
        name: process.env.DB_NAME
    }
}

const pro = {
    app: {
        port: process.env.PORT
    },
    db: {
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        pass: process.env.DB_PASS,
        name: process.env.DB_NAME
    }
}

const config = {dev, pro}
const env = process.env.ENV || 'dev'

module.exports = config[env]