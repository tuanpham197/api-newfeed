'use strict'

const express = require('express')
const planController = require('../../controllers/plan.controller')
const { asyncHandler } = require('../../helpers/asyncHandler')
const {authenticationV2} = require('../../auth/authUtil')
const router = express.Router()


router.get('/search/:keySearch', asyncHandler(planController.getListSearchPlan))
router.get('', asyncHandler(planController.findAllPlans))
router.get('/:id', asyncHandler(planController.findPlan))

// authentication
router.use(authenticationV2)

////////////////
router.post('/', asyncHandler(planController.createPlan))
router.patch('/:id', asyncHandler(planController.updatePlan))
router.post('/publish/:id', asyncHandler(planController.publishPlan))
router.post('/unpublish/:id', asyncHandler(planController.unPublishPlan))


/// QUERY 
router.get('/drafts/all', asyncHandler(planController.getAllDrafts))
router.get('/publish/all', asyncHandler(planController.getAllPublish))


module.exports = router