import User from "../models/User.js";
import bcrypt from "bcrypt";
import Joi from "joi";
import _ from "lodash";
import responseMessage from "../utils/constant.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import redisClient from "../../config/redisConnect.js";

/**
 * Controller for Signup / registration
 */

const signup = async (req, res) => {
  try {
    console.log(
      "================= SIGNUP REQUEST: User Session Management Controller ================="
    );
    const request = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };

    const schema = Joi.object({
      name: Joi.string().required(),
      password: Joi.string().required(),
      email: Joi.string()
        .email({
          minDomainSegments: 2,
          tlds: { allow: ["com", "net"] },
        })
        .required(),
    });

    const validateRequest = schema.validate(request);

    if (validateRequest.error) {
      return res.status(400).send({
        message: validateRequest.error.message,
      });
    }

    //Check if email already registered or not
    const userEmailExists = await User.findOne({ email: request.email });
    if (userEmailExists) {
      return res.status(400).send({
        message: responseMessage.EMAIL_ALREADY_EXISTS,
      });
    }

    const lastUserId = await User.find({}, "userId")
      .sort({ userId: -1 })
      .limit(1);

    if (!_.isEmpty(lastUserId)) {
      request.userId = lastUserId[0].userId + 1;
    } else {
      request.userId = 1;
    }

    //Encrypt Password
    const salt = bcrypt.genSaltSync(Number(process.env.SALT));
    const hash = bcrypt.hashSync(request.password, salt);

    request.password = hash;

    //Create User
    await User.create(request);

    return res.status(200).send({
      message: responseMessage.SIGN_UP_SUCCESS,
    });
  } catch (err) {
    console.error("Error while creating new user: ", err.message);
    res.status(500).send({
      message: responseMessage.ERR_MSG_ISSUE_IN_SIGNUP_API,
    });
  }
};

/**
 * Controller for Login
 */

const login = async (req, res) => {
  try {
    console.log(
      "================= LOGIN REQUEST: User Session Management Controller ================="
    );
    const request = {
      email: req.body.email,
      password: req.body.password,
    };
    console.log(request);

    const schema = Joi.object({
      email: Joi.string()
        .email({
          minDomainSegments: 2,
          tlds: { allow: ["com", "net"] },
        })
        .required(),
      password: Joi.string().required(),
    });

    const validateRequest = schema.validate(request);
    if (validateRequest.error) {
      return res.status(400).send({
        message: validateRequest.error.message,
      });
    }

    //Check if user exists or not
    let startTime = new Date();
    const userExists = await User.findOne(
      { email: request.email, deletedAt: null },
      "userId password"
    );
    let endTime = new Date();
    let timeElapsed = endTime - startTime;
    console.log("DB Time: ", timeElapsed);

    if (_.isEmpty(userExists)) {
      return res.status(400).send({
        message: responseMessage.USER_NOT_FOUND,
      });
    }

    const userId = userExists.userId;

    startTime = new Date();
    const isPasswordVaild = await bcrypt.compare(
      request.password,
      userExists.password
    );
    endTime = new Date();
    timeElapsed = endTime - startTime;
    console.log("Bcrypt Time: ", timeElapsed);

    if (!isPasswordVaild) {
      return res.status(400).send({
        message: responseMessage.PASSWORD_WRONG,
      });
    }

    //Generate Access Token
    startTime = new Date();
    const accessToken = await generateAccessToken(userId);
    endTime = new Date();
    timeElapsed = endTime - startTime;
    console.log("Access Time: ", timeElapsed);
    startTime = new Date();
    const refreshToken = await generateRefreshToken(userId);
    endTime = new Date();
    timeElapsed = endTime - startTime;
    console.log("Refresh Time: ", timeElapsed);

    return res.status(200).send({
      message: responseMessage.LOG_IN_SUCCESS,
      data: {
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    });
  } catch (err) {
    console.error("Error while logging in user: ", err.message);
    res.status(500).send({
      message: responseMessage.ERR_MSG_ISSUE_IN_LOGIN_API,
    });
  }
};

/**
 * Controller for Logout
 */

const logout = async (req, res) => {
  try {
    const userId = req.sessionData.id;

    const token = req.accessToken;

    // remove the refresh token
    await redisClient.del(userId.toString());

    // blacklist current access token
    await redisClient.set("BL_" + userId.toString(), token);

    return res.status(200).send({
      message: responseMessage.LOG_OUT_SUCCESS,
    });
  } catch (err) {
    console.error("Error while logging in user: ", err.message);
    res.status(500).send({
      message: responseMessage.ERR_MSG_ISSUE_IN_LOGOUT_API,
    });
  }
};

/**
 * Controller for generating Access Token
 */

const generateToken = async (req, res) => {
  try {
    const userId = req.sessionData.id;

    //Generate Access Token
    const accessToken = await generateAccessToken(userId);
    const refreshToken = await generateRefreshToken(userId);

    return res.status(200).send({
      message: responseMessage.ACCESS_TOKEN_GENERATED,
      data: {
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    });
  } catch (err) {
    console.error("Error while logging in user: ", err.message);
    res.status(500).send({
      message: responseMessage.ERR_MSG_ISSUE_IN_LOGOUT_API,
    });
  }
};

export { signup, login, logout, generateToken };
