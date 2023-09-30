"use strict";

const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtil");
const { getInfoData } = require("../utils");
const { BadRequestError, AuthFailureError } = require("../core/error.response");
const { findByEmail } = require("./user.service");

const Role = {
  AUTHOR: "author",
  MEMBER: "member",
};
class AuthService {

  static logout = async( keyStore) => {
    console.log("LOGOUT");
    const delKey = await KeyTokenService.removeKeyById(keyStore._id)
    console.log(delKey);
    return delKey
  }
  /**
   * 1 - check email
   * 2 - match pass
   * 3 - create AC, RF token save
   * 4 - general token
   * 5 - get info
   */
  static login = async( {email, password, refreshToken = null}) => {
    const foundUser = await findByEmail({email})
    if (!foundUser) {
      throw new BadRequestError('shop not registed')
    }
    const match = bcrypt.compare(password, foundUser.password)

    if(!match) throw new AuthFailureError('Unauthorized')

    // tao key
    const privateKey = crypto.randomBytes(64).toString('hex');
    const publicKey = crypto.randomBytes(64).toString('hex');

    // tao token
    const tokens = await createTokenPair(
      {
        userId: foundUser._id,
        email,
      },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken({
      userId: foundUser._id,
      refreshToken: tokens.refresh_token,
      privateKey, publicKey
    })

    return {
      user: getInfoData({
        fields: ["name", "_id", "email", "roles", "status"],
        objectParse: foundUser,
      }),
      tokens,
    };

  }

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
        // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
        //   modulusLength: 4096,
        //   publicKeyEncoding: {
        //     type: "pkcs1",
        //     format: "pem",
        //   },
        //   privateKeyEncoding: {
        //     type: "pkcs1",
        //     format: "pem",
        //   },
        // });

        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');

        console.log({ privateKey, publicKey });

        

        // const publicKeyObject = crypto.createPublicKey(publicKeyString);

        const tokens = await createTokenPair(
          {
            userId: newUser._id,
            email,
          },
          publicKey,
          privateKey
        );
        console.log("create token success", tokens);
        
        const refreshToken = tokens.refresh_token
        const keyStore = await KeyTokenService.createKeyToken({
          userId: newUser._id,
          publicKey,
          privateKey,
          refreshToken
        });

        console.log("keyStore: ", keyStore);

        if (!keyStore) {
          return {
            code: "500",
            message: "publickeystring errors",
          };
        }

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
