import axios from "axios";
import responseMessage from "../utils/constant.js";
async function verifyToken(req, res, next) {
  console.log("Token Verification");
  try {
    // Bearer tokenstring
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).send({
        message: responseMessage.TOKEN_NOT_FOUND,
      });
    }

    //Request to user Service for token verification
    const response = await axios({
      method: "post",
      url: `${process.env.AUTH_SERVICE_URL}/verify`,
      data: {
        token: token,
      },
    });

    if (response.data.data.isValid) {
      req.sessionData = {
        id: response.data.data.userId,
      };
      next(); // Token is valid, proceed to the next middleware
    } else {
      return res.status(401).json({
        message: response.data.message,
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: responseMessage.ERROR_OCCURED,
    });
  }
}

export { verifyToken };
