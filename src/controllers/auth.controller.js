'use strict'

const AuthService = require("../services/auth.service");
const {OK, CREATED, SuccessResponse} = require('../core/sucess.response')

class AuthController {
    handleRefreshToken = async (req, res, next) => {
        // new SuccessResponse({
        //     metadata: await AuthService.handleRefreshToken(req.body.refresh_token),
        //     statusCode: 200,
        //     message: 'Refresh token Success'
        // }).send(res)

        // V2
        new SuccessResponse({
            metadata: await AuthService.handleRefreshTokenV2({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore
            }),
            statusCode: 200,
            message: 'Refresh token Success'
        }).send(res)
    }

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