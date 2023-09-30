'use strict'

const express = require('express')
const authController = require('../../controllers/auth.controller')
const { asyncHandler } = require('../../helpers/asyncHandler')
const {authentication} = require('../../auth/authUtil')
const router = express.Router()


router.post('/signup', asyncHandler(authController.signUp))
router.post('/signin', asyncHandler(authController.login))

// authentication
router.use(authentication)

router.post('/logout', asyncHandler(authController.logout))


module.exports = router