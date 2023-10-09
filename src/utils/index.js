'use strict'

const _ = require('lodash')
const { Types } = require('mongoose')

const convertToObjectIdMongoDb = id => new Types.ObjectId(id)

const getInfoData = ({fields = [], objectParse = {}}) => {
    return _.pick(objectParse, fields)
}

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]))
}

const getUnSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 0]))
}

const removeNonValueField = obj => {
    console.log(`[12]::`, obj);
    Object.keys(obj).forEach(k => {

        if (obj[k] == null) {
            delete obj[k]
        } 
    })
    console.log(`[12 AFTER]::`, obj);
    return obj
}

const updateNestedObjectParser = obj => {
    const final = {}
    Object.keys(obj || {}).forEach(k => {
        if (typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
            const res = updateNestedObjectParser(obj[k])
            Object.keys(res || {}).forEach(a => {
                final[`${k}.${a}`] = res[a]
            })
        }else {
            final[k] = obj[k]
        }
    })
    return final
}

module.exports = {
    getInfoData,
    getSelectData,
    getUnSelectData,
    removeNonValueField,
    updateNestedObjectParser,
    convertToObjectIdMongoDb
}