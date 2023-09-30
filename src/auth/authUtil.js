'use strict'

const jwt = require('jsonwebtoken')

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        //accesstoken
        const accessToken = await jwt.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '2 days'
        })

        const refreshToken = await jwt.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '7 days'
        })

        jwt.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.log(`ERR:: ${err.message}`);
            } else {
                console.log(`DONE:: data:`, decode);
            }
        })
        return {
            access_token: accessToken,
            refresh_token: refreshToken
        }

    } catch (error) {
        
    }
}

module.exports = {
    createTokenPair
}