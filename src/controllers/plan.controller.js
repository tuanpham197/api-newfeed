'use strict'

const PlanService = require("../services/plan.service.xxx");
const { SuccessResponse} = require('../core/sucess.response')

class PlanController {
    createPlan = async (req, res, next) => {
      
        new SuccessResponse({
            message: 'Create new plan success',
            metadata: await PlanService.createPlan(req.body.plan_type, {
                ...req.body,
                plan_owner: req.user.userId
            }),
            statusCode: 201
        }).send(res)
    }

    publishPlan = async (req, res, next) => {
        new SuccessResponse({
            message: 'Publish plan success',
            metadata: await PlanService.publishPlanByOwner({
                plan_owner: req.user.userId,
                plan_id: req.params.id
            }),
            statusCode: 200
        }).send(res)
    }

    unPublishPlan = async (req, res, next) => {
        new SuccessResponse({
            message: 'unPublish plan success',
            metadata: await PlanService.unPublishPlanByOwner({
                plan_owner: req.user.userId,
                plan_id: req.params.id
            }),
            statusCode: 200
        }).send(res)
    }


    /**
     * @desc Get all drafts for owner
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     * 
     * @return {JSON}
     */
    getAllDrafts = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list draft plan success',
            metadata: await PlanService.findAllPlanDraft({
                plan_owner: req.user.userId
            }),
            statusCode: 201
        }).send(res)
    }

    getAllPublish = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list draft plan success',
            metadata: await PlanService.findAllPlanPublish({
                plan_owner: req.user.userId
            }),
            statusCode: 201
        }).send(res)
    }

    getListSearchPlan = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list draft plan success',
            metadata: await PlanService.searchPlans(req.params),
            statusCode: 200
        }).send(res)
    }

    findAllPlans = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list  plan success',
            metadata: await PlanService.findAllPlans(req.query),
            statusCode: 200
        }).send(res)
    }

    findPlan = async (req, res, next) => {
        console.log(req.params);
        new SuccessResponse({
            message: 'Get one  plan success',
            metadata: await PlanService.findPlan({plan_id: req.params.id}),
            statusCode: 200
        }).send(res)
    }

    updatePlan = async (req, res, next) => {
        new SuccessResponse({
            message: 'update plan success',
            metadata: await PlanService.updatePlan(req.body.plan_type, req.params.id, {
                ...req.body,
                plan_owner: req.user.userId
            }),
            statusCode: 200
        }).send(res)
    }
}

module.exports = new PlanController()