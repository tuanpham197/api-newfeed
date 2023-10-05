"use strict";

const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtil");
const { getInfoData } = require("../utils");
const { BadRequestError } = require("../core/error.response");

const Role = {
  AUTHOR: "author",
  MEMBER: "member",
};
class AuthService {
  static signUp = async ({ name, email, password }) => {
    try {
      const user = await userModel.findOne({ email }).lean();

      if (user) {
        // return {
        //   code: "400",
        //   message: "user exists",
        //   status: "error",
        // };
        throw new BadRequestError('user exists')
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const newUser = await userModel.create({
        email,
        name,
        password: passwordHash,
        roles: [Role.MEMBER],
      });

      if (newUser) {
        // create private key, public key
        const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
          privateKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
        });

        console.log({ privateKey, publicKey });

        const publicKeyString = await KeyTokenService.createKeyToken({
          userId: newUser._id,
          publicKey,
        });

        if (!publicKeyString) {
          return {
            code: "500",
            message: "publickeystring error",
          };
        }

        const publicKeyObject = crypto.createPublicKey(publicKeyString);

        const tokens = await createTokenPair(
          {
            userId: newUser._id,
            email,
          },
          publicKeyObject,
          privateKey
        );
        console.log("create token success", tokens);

        return {
          code: 201,
          data: {
            user: getInfoData({
              fields: ["name", "_id", "email", "roles", "status"],
              objectParse: newUser,
            }),
            tokens,
          },
        };
      }
      return {
        code: 200,
        data: null,
      };
    } catch (err) {
      return {
        code: "500",
        message: err.message,
        status: "error",
      };
    }
  };
}

module.exports = AuthService;
