import jwt from "jsonwebtoken";
import redisClient from "../../config/redisConnect.js";

export const generateAccessToken = async (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_TIME,
  });

  return accessToken;
};

export const generateRefreshToken = async (userId) => {
  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_TIME }
  );

  await redisClient.set(
    userId.toString(),
    JSON.stringify({ token: refreshToken })
  );

  return refreshToken;
};
