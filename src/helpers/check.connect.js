'use strict'

const mongoose = require('mongoose')
const os = require('os')
const process = require('process')

const _M_SECONDS = 5000

const countConnect = () => {
    return mongoose.connections.length
}

const checkOverload = () => {
    setInterval(()=>{
        const numCon = countConnect()
        const numCores = os.cpus().length
        const memoryUsage = process.memoryUsage().rss

        // example maximum number of connections based on number of cores
        const maxConnections = numCores * 5

        console.log(`Active connection:: ${numCon}`);
        console.log(`Memory usage:: ${memoryUsage/ 1024 / 1024} MB`);

        if (numCon > maxConnections) {
            console.log(`Connection overload`);
            // send notify alert
        }

    }, _M_SECONDS)
}

module.exports = {
    countConnect,
    checkOverload
}