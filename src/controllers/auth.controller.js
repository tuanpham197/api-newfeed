'use strict'

const AuthService = require("../services/auth.service");

class AuthController {

    signUp = async (req, res, next) => {
        try {
            console.log(`[P]::signUp::`, req.body);

            const body = await AuthService.signUp(req.body)
            return res.status(201).json(body)
        } catch (err) {
            next(err)
        }
    }
}

module.exports = new AuthController()