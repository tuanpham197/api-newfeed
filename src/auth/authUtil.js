'use strict'

const jwt = require('jsonwebtoken')
const { asyncHandler } = require('../helpers/asyncHandler')
const { AuthFailureError, NotFoundError } = require('../core/error.response')
const KeyTokenService = require('../services/keyToken.service')


const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'client-id',
    AUTHORIZATION: 'authorization'
}

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        //accesstoken
        const accessToken = await jwt.sign(payload, publicKey, { // privateKey for advanced
            // algorithm: 'RS256',
            expiresIn: '2 days'
        })

        const refreshToken = await jwt.sign(payload, privateKey, {
            // algorithm: 'RS256',
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

const authentication = asyncHandler(async (req, res, next) => {
    /**
     * 1 - check userId missing
     * 2 - get accesstoken
     * 3 - verify token
     * 4 - check user in db
     * 5 - check keys store with this userId
     * 6 - ok all => return next 
     */
    const userId = req.headers[HEADER.CLIENT_ID]
    if (!userId) throw new AuthFailureError("Invalid request")

    //2
    const keyStore = await KeyTokenService.findByUserId(userId)
    if (!keyStore) throw new NotFoundError('Not found error')

    //3
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) throw new AuthFailureError("Invalid request")
    try {
        
        const token = accessToken.split(" ");
        console.log("accessToken", token);
        console.log("publicKey", keyStore.publicKey);
        const decodeUser = jwt.verify(token[1], keyStore.publicKey)
        console.log("2222");
        if (userId !== decodeUser.userId) {
            throw new AuthFailureError('Invalid user id')
        }
        console.log("2343243", keyStore);

        req.keyStore = keyStore
        return next()
    } catch (error) {
        throw error
    }
})

module.exports = {
    createTokenPair,
    authentication
}