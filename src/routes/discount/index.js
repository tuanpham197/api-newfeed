'use strict'

const express = require('express')
const discountController = require('../../controllers/discount.controller')
const { asyncHandler } = require('../../helpers/asyncHandler')
const {authenticationV2} = require('../../auth/authUtil')
const router = express.Router()


router.post('/amount', asyncHandler(discountController.getAllDiscountAmount))
router.get('/list-plan-code', asyncHandler(discountController.getAllDiscountCodeWithPlan))

router.use(authenticationV2)

router.post('', asyncHandler(discountController.createDiscountCode))
router.get('', asyncHandler(discountController.getAllDiscountCode))

module.exports = router