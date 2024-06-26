'use strict'

const keytokenModel = require("../models/keytoken.model")
const { Types } = require('mongoose')

class KeyTokenService {
    static createKeyToken = async ({userId, publicKey, privateKey, refreshToken}) => {
        try {
            // const publicKeyString = publicKey.toString()

            // const tokens = await keytokenModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey
            // })

            // return tokens ? tokens.publicKey : null

            // high level
            const filter = {user: userId}, update = {
                publicKey, privateKey, refreshTokensUsed: [], refreshToken
            }, options = {upsert: true, new: true}
            const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)
            return tokens ? tokens.publicKey : null 
        } catch (err) {
            return err
        }
    }

    static findByUserId = async (userId) => {
        return await keytokenModel.findOne({user: new Types.ObjectId(userId)})
    }

    static removeKeyById = async (id) => {
        return await keytokenModel.findOneAndRemove(id)
    }

    static findByRefreshTokenUsed = async (refreshToken) => {
        return keytokenModel.findOne({refreshTokensUsed: refreshToken}).lean()
    }
    static deleteKeys = async (userId) => {
        return await keytokenModel.deleteOne({user: userId})
    }

    static findByRefreshToken = async (refreshToken) => {
        return keytokenModel.findOne({refreshToken})
    }
}

module.exports = KeyTokenService