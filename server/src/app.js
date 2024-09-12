const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const authRouter = require('./routes/authRouter');
const tokenRouter = require('./routes/token.router');
const fileRouter = require('./routes/fileRouter');
const path = require('path');

const app = express();

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api/uploads', express.static(path.resolve(__dirname, '../uploads')));


app.use('/api/auth', authRouter);
app.use('/api/tokens', tokenRouter);
app.use('/api/files', fileRouter); 

module.exports = app;