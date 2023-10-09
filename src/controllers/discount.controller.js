'use strict'

const PlanService = require("../services/discount.service");
const { SuccessResponse} = require('../core/sucess.response');
const DiscountService = require("../services/discount.service");

class DiscountController {
    createDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successful code generate',
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                userId: req.user.userId
            }),
            statusCode: 201
        }).send(res)
    }

    getAllDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successful code found',
            metadata: await DiscountService.getAllDiscountCodesByShop({
                ...req.query,
                userId: req.user.userId
            }),
            statusCode: 200
        }).send(res)
    }

    getAllDiscountAmount = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successful code found',
            metadata: await DiscountService.getDiscountAmount({
                ...req.body,
            }),
            statusCode: 200
        }).send(res)
    }

    getAllDiscountCodeWithPlan = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successful code found',
            metadata: await DiscountService.getAllDiscountCodeWithPlan({
                ...req.query,
            }),
            statusCode: 200
        }).send(res)
    }
}

module.exports = new DiscountController()