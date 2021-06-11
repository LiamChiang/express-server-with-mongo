//load the .env config file
require('dotenv').config();

//load all required package
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');

const app = express();
const router = express.Router();
const routes = require('./routes/index');

const environment = process.env.NODE_ENV
const stage = require('./config')[environment];
const port = stage.port;

// app implement the bodyParser to load the body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// logging the env
app.use(logger(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms'
    ].join(' ')
}));

// Simple return for base api
// app.use('/v1', (req, res, next) => {
//     res.send('Welcome to test the Web App \n');
//     next();
// });

// start implement the routes of the endpoint
app.use('/v1', routes(router));

// Listening the specified port with localhost
app.listen(port, () => {
    console.log('Server listening at 127.0.0.1:', port);
});

module.exports = app;