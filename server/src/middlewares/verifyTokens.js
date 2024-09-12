const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyAccessToken = (req, res, next) => {
  try {
    const accessToken = req.headers.authorization.split(' ')[1]; // Bearer <token>
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded.user; // Сохраняем данные пользователя в req.user

    return next();
  } catch (error) {
    console.log('Invalid access token');
    return res.sendStatus(403); // Access token неверный
  }
};

const verifyRefreshToken = (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    const { user } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    res.locals.user = user;

    return next();
  } catch (error) {
    console.log('Invalid refresh token');
    return res.clearCookie('refreshToken').sendStatus(401);
  }
};

module.exports = { verifyAccessToken, verifyRefreshToken };
