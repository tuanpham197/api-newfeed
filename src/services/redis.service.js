'use strict'

const { resolve } = require('path')
const redis = require('redis')
const {promisify} = require('util')
const { reservationInventory } = require('../models/repositories/inventory.repo')
const redisClient = redis.createClient()

const pexpire = promisify(redisClient.pexpire).bind(redisClient)
const setnxAsync = promisify(redisClient.setNX).bind(redisClient)

const acquireLock = async (planId, quantity, cartId) => {
    const key = `lock_v2023_${planId}`
    const retryTimes = 10
    const expireTime = 3000 // 3 second tam lock

    for (let i = 0; i < retryTimes.length; i++) {
        // tao mot key, thang nao nam giu duoc vao
        const result = await setnxAsync(key, expireTime)
        console.log(`result::`, result);
        if (result === 1) {
            // thao tac voi inventory
            const isReversation = await reservationInventory({
                planId, quantity, cartId
            })

            if (isReversation.modifiedCount) {
                await pexpire(key, expireTime)
                return key
            }

            return null
        } else{
            await new Promise((resolve) => setTimeout(resolve, 50))
        }
    }
}

const releaseLock = async keyLock => {
    const delAsyncKey = promisify(redisClient.del).bind(redisClient)
    return await delAsyncKey(keyLock)
}

module.exports = {
    acquireLock,
    releaseLock
}