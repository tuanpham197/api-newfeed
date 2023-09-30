'use strict'

const apikeyModel = require("../models/apikey.model")
const crypto = require('crypto')

const findById = async (key) => {
    // await apikeyModel.create({
    //     key: '96ce1d676f51102850aec6049fc4ee00e4a3a4231d911ba5a152470cff83eec233bd13743fe252baa7ba095850dbb590151bd40000a9f13231929240495933c3',
    //     permissions: ['0000'],
    //     status: true
    // })

    const objKey = await apikeyModel.findOne({key, status: true}).lean()
    return objKey 
}

module.exports = {
    findById
}