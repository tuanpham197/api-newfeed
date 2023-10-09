'use strict'

const express = require('express')
const { apiKey, permission } = require('../auth/checkAuth')
const router = express.Router()

// check apikey
router.use(apiKey)
// check permission
router.use(permission('0000'))

router.use('/v1/api/carts', require('./cart'))
router.use('/v1/api/discounts', require('./discount'))
router.use('/v1/api/plans', require('./plan'))

router.use('/v1/api', require('./auth'))



module.exports = router