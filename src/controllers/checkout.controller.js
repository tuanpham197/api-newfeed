'use strict'

const CheckoutService = require("../services/checkout.service");
const { SuccessResponse} = require('../core/sucess.response');

class CheckoutController {
    checkoutReview = async (req, res, next) => {
        new SuccessResponse({
            message: 'checkout order success',
            metadata: await CheckoutService.checkoutReview(req.body),
            statusCode: 200
        }).send(res)
    }

}

module.exports = new CheckoutController()