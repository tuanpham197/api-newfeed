'use strict'

const express = require('express')
const authController = require('../../controllers/auth.controller')
const { asyncHandler } = require('../../helpers/asyncHandler')
const {authenticationV2} = require('../../auth/authUtil')
const router = express.Router()
const { asyncHandler } = require('../../auth/checkAuth')


router.post('/signup', asyncHandler(authController.signUp))
router.post('/signin', asyncHandler(authController.login))

// authentication
router.use(authenticationV2)

router.post('/logout', asyncHandler(authController.logout))
router.post('/refresh-token', asyncHandler(authController.handleRefreshToken))


module.exports = router