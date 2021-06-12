const ObjectId = require('mongodb').ObjectId;
const Users = require("../models/user");
const utils = require('../utils');
const generateAccessToken = utils.generateAccessToken;

module.exports = {
  findByAccount: async(req, res) => {
    const { account } = req.params;
    let result = {};
    let status = 200;
    try {
        const returnedRes = await Users.findOne({ account: account }).exec();
        if (returnedRes) {
            result.status = status;
            result.result = returnedRes;
            res.status(status).send(result);
        }
    }
    catch(err) {
        status = 500;
        result.status = status;
        result.error = err;
        res.status(status).send(result);
    }
  },
  register: async (req, res) => {
    let result = {};
    let status = 200;
    try {
        const { account, password } = req.body;
        const _Users = new Users({ account, password });

        // check whether the account has been registered before
        const findAccount = await Users.findOne({ account: account });
        if (findAccount) {
            status = 500;
            result.status = status;
            result.error = 'The account has been registered';
        }
        else {
            // hash the user password before store into the db
            const returnedRes = await _Users.save();
            if (returnedRes) {
                const jwtToken = generateAccessToken({account: returnedRes.account, password: returnedRes.password});
                result.status = status;
                result.result = `Successfully registered the account: ${returnedRes.account}. The token will be expired after a day`;
                result.token = jwtToken;
            }
            else {
                console.log('testing');
                status = 500;
                result.status = status;
                result.error = 'Unable to create the new user';
            }
        }
        res.status(status).send(result);
    }
    catch(err) {
        status = 500;
        result.status = status;
        result.error = 'Unable to create the new user. Please check whether the account has been registered';
        res.status(status).send(result);
    }
  },
  login: async (req, res) => {
    const { account, password } = req.body;
    let result = {};
    let status = 200;
    
    try {
        const returnedRes = await Users.findOne({ account: account });
        if (!returnedRes) {
            status = 500;
            result.status = status;
            result.error = 'Unable to find the user, please make sure the account has been registered';
        }
        else {
            const isMatch = await Users.verifyPassword(password, returnedRes.password);
            if (isMatch) {
                const jwtToken = generateAccessToken({account: returnedRes.account, password: returnedRes.password});
                result.status = status;
                result.result = `Successfully log into the account: ${returnedRes.account}. The token will be expired after a day`;
                result.token = jwtToken;
            }
            else {
                status = 404;
                result.status = status;
                result.error = 'Authentication failed';
            }
        }
        res.status(status).send(result);
    }
    catch(err) {
        status = 500;
        result.status = status;
        result.error = 'Unable to sign in currently. Please try again later';
        res.status(status).send(result);
    }
  },
  deleteByAccount: async(req, res) => {
    const { account } = req.params;
    let result = {};
    let status = 200;
    try {
        const findUser = await Users.findOne({ account: account }).exec();
        if (findUser) {
            const returnedRes = await Users.deleteOne({ _id:  new ObjectId(findUser._id) });
            if (returnedRes) {
                result.status = status;
                result.result = 'Successfully delete the account';
                res.status(status).send(result);
            }
            else {
                status = 500;
                result.status = status;
                result.result = 'Unable to delete the user account';
                res.status(status).send(result);
            }
        }
        else {
            status = 500;
            result.status = status;
            result.error = 'Unable to delete the non-exist user account';
            res.status(status).send(result);
        }
    }
    catch(err) {
        status = 500;
        result.status = status;
        result.error = err;
        res.status(status).send(result);
    }
  }
};
