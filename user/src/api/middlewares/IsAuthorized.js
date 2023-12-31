import jwt from "jsonwebtoken";
import redisClient from "../../config/redisConnect.js";
import responseMessage from "../utils/constant.js";

async function verifyToken(req, res, next) {
  try {
    // Bearer tokenstring
    const token = req.headers.authorization.split(" ")[1];
    console.log("token", token, typeof token);

    if (!token) {
      return res.status(403).send({
        message: responseMessage.TOKEN_NOT_FOUND,
      });
    }

    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    console.log(payload);

    req.accessToken = token;
    req.sessionData = payload;

    // varify blacklisted access token.
    const data = await redisClient.get("BL_" + req.sessionData.id.toString());
    if (data === token) {
      return res.status(401).json({
        message: responseMessage.BLACKLISTED_TOKEN,
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      message: responseMessage.INVALID_SESSION,
      data: error,
    });
  }
}

async function verifyRefreshToken(req, res, next) {
  try {
    const token = req.body.token;

    if (!token) {
      return res.status(403).send({
        message: responseMessage.TOKEN_NOT_FOUND,
      });
    }

    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    req.accessToken = token;
    req.sessionData = payload;

    // verify if token is stored or not
    const data = await redisClient.get(req.sessionData.id.toString());

    if (!data) {
      return res.status(401).json({
        message: responseMessage.UNAUTHORIZED,
      });
    }

    if (JSON.parse(data).token != token) {
      return res.status(401).json({
        message: responseMessage.UNAUTHORIZED,
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      message: responseMessage.INVALID_SESSION,
      data: error,
    });
  }
}

export { verifyToken, verifyRefreshToken };
