'use strict'

const express = require('express')
const inventiryController = require('../../controllers/inventory.controller')
const { asyncHandler } = require('../../helpers/asyncHandler')
const {authenticationV2} = require('../../auth/authUtil')
const router = express.Router()

router.use(authenticationV2)

router.post('/', asyncHandler(inventiryController.addStockToInventory))


module.exports = router