'use strict'

const AuthService = require("../services/auth.service");
const {OK, CREATED, SuccessResponse} = require('../core/sucess.response')

class AuthController {
    logout = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AuthService.logout(req.keyStore),
            statusCode: 200,
            message: 'Logout Success'
        }).send(res)
    }

    login = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AuthService.login(req.body),
            statusCode: 200,
            message: 'Success'
        }).send(res)
    }

    signUp = async (req, res, next) => {
        new CREATED({
            message: 'Registed OK!',
            metadata: await AuthService.signUp(req.body)
        }).send(res)
    }
}

module.exports = new AuthController()