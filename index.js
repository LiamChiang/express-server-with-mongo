//load the .env config file
require('dotenv').config();

//load the mongoose to connect to mongoDB
const mongoose = require("mongoose");

// load the requried mongoDN connect url
const connUri = process.env.MONGO_URL;
const mongoPort = process.env.MONGO_PORT;
const db = process.env.MONGO_DB;
const url = `${connUri}:${mongoPort}/${db}`;

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

// start implement the routes of the endpoint
app.use('/v1', routes(router));

// connecting to the mongoDB
mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true, autoIndex: true }, (err) => {
    if (err) {
        console.log('Unable to connect to mongo!');
        throw err;
    }
}); 

// Listening the specified port with localhost
app.listen(port, () => {
    console.log('Server listening at 127.0.0.1:', port);
});

module.exports = app;