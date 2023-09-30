'use strict'

const _ = require('lodash')

const getInfoData = ({fields = [], objectParse = {}}) => {
    return _.pick(objectParse, fields)
}

module.exports = {
    getInfoData
}