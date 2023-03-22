require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');

const app = express();
const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common';

const errorHandler = require('./errorHandler');
const authRouter = require('./auth/auth-router');
const usersRouter = require('./users/users-router');
const employeesRouter = require('./employees/employees-router');

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Boilerplate Working!');
});

app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/employees', employeesRouter);

app.use(errorHandler);

module.exports = app;