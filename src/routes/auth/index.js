'use strict'

const express = require('express')
const authController = require('../../controllers/auth.controller')
const router = express.Router()
const { asyncHandler } = require('../../auth/checkAuth')

router.post('/signup', asyncHandler(authController.signUp))

module.exports = router