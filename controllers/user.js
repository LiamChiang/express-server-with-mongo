const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const connUri = process.env.MONGO_URL;
const mongoPort = process.env.MONGO_PORT;
const db = process.env.MONGO_DB;
const url = `${connUri}:${mongoPort}/${db}`;

module.exports = {
  add: (req, res) => {
    mongoose.connect(url, { useNewUrlParser: true }, (err) => {
      let result = {};
      let status = 200;
      if (!err) {
        const { account, password } = req.body;
        const user = new User({ account, password });
        // hash the user password before store into the db
        user.save((err, user) => {
          if (!err) {
            result.status = status;
            result.result = user;
          } else {
            status = 500;
            result.status = status;
            result.error = err;
          }
          res.status(status).send(result);
        });
      } else {
        status = 500;
        result.status = status;
        result.error = err;
        res.status(status).send(result);
      }
    });
  },
  login: (req, res) => {
    const { account, password } = req.body;
    mongoose.connect(url, { useNewUrlParser: true }, (err) => {
      let result = {};
      let status = 200;
      if (!err) {
        User.findOne({ account }, (err, user) => {
          if (!err && user) {
              console.log()
            bcrypt.compare(password, user.password)
                .then(match => {
                    console.log('match: ', match);
                    if (match) {
                        result.status = status;
                        result.result = user;
                    } 
                    else {
                        status = 401;
                        result.status = status;
                        result.error = 'Authentication error';
                    }
                    res.status(status).send(result);
                })
                .catch(err => {
                    status = 500;
                    result.status = status;
                    result.error = err;
                    res.status(status).send(result);
                });
          } else {
            status = 404;
            result.status = status;
            result.error = err;
            res.status(status).send(result);
          }
        });
      } else {
        status = 500;
        result.status = status;
        result.error = err;
        res.status(status).send(result);
      }
    });
  },
};
