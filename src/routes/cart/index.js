'use strict'

const express = require('express')
const cartController = require('../../controllers/cart.controller')
const { asyncHandler } = require('../../helpers/asyncHandler')
const {authenticationV2} = require('../../auth/authUtil')
const router = express.Router()


router.post('', asyncHandler(cartController.addToCart))
router.delete('', asyncHandler(cartController.delete))
router.post('/update', asyncHandler(cartController.update))
router.get('', asyncHandler(cartController.listToCart))

// router.use(authenticationV2)



module.exports = router