const authRouter = require('express').Router();
const bcrypt = require('bcrypt');
const { User } = require('../../db/models');
const generateTokens = require('../utils/generateTokens');
const cookieConfig = require('../configs/cookie.config');
const jwt = require('jsonwebtoken'); 

authRouter.post('/signup', async (req, res) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const [user, created] = await User.findOrCreate({
      where: { email },
      defaults: { name, password: await bcrypt.hash(password, 10) },
    });

    if (!created) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const plainUser = user.get();
    delete plainUser.password;

    const { accessToken, refreshToken } = generateTokens({ user: plainUser });

    res
      .cookie('refreshToken', refreshToken, cookieConfig.refresh)
      .json({ user: plainUser, accessToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Server error' });
  }
});

authRouter.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Не верный логин или пароль' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(400).json({ error: 'Не верный логин или пароль' });
    }

    const plainUser = user.get();
    delete plainUser.password;

    const { accessToken, refreshToken } = generateTokens({ user: plainUser });
    res
      .cookie('refreshToken', refreshToken, cookieConfig.refresh)
      .json({ user: plainUser, accessToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Server error' });
  }
});

authRouter.post('/signin/new_token', (req, res) => {
    const { refreshToken } = req.cookies;
  
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token not provided' });
    }
  
    try {
      const userData = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  
      const { accessToken } = generateTokens({ user: userData });
  
      res.json({ accessToken });
    } catch (error) {
      console.log(error);
      return res.status(403).json({ error: 'Invalid refresh token' });
    }
  });

authRouter.get('/logout', (req, res) => {
  res.clearCookie('refreshToken')
  .sendStatus(200);
});

authRouter.get('/info', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Извлекаем токен из заголовка Authorization
  
    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }
  
    // Проверяем валидность access токена
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid or expired access token' });
      }
  
      // Возвращаем ID пользователя
      res.json({ userId: user.id });
    });
  });
  

module.exports = authRouter;
