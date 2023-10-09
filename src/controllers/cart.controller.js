'use strict'

const CartService = require("../services/cart.service");
const { SuccessResponse} = require('../core/sucess.response');

class CartController {
    addToCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successful cart generate',
            metadata: await CartService.addToCart(req.body),
            statusCode: 201
        }).send(res)
    }

    update = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successful cart update',
            metadata: await CartService.addToCartv2(req.body),
            statusCode: 200
        }).send(res)
    }

    delete = async (req, res, next) => {
        new SuccessResponse({
            message: 'delete cart success',
            metadata: await CartService.deleteCustomerCart(req.body),
            statusCode: 200
        }).send(res)
    }

    listToCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'List  cart success',
            metadata: await CartService.getListCustomerCart(req.query),
            statusCode: 200
        }).send(res)
    }

    
}

module.exports = new CartController()