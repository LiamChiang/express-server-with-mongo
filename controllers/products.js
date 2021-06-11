const ObjectId = require('mongodb').ObjectId;
const jwt = require('jsonwebtoken');
const Products = require("../models/products");

controller = {
    findByCode: async (req, res) => {
        const { code } = req.params;
        let result = {};
        let status = 200;
        try {
            const returnedRes = await Products.find({ code: code }).exec();
            if (returnedRes) {
                result.status = status;
                result.result = returnedRes;
                res.status(status).send(result);
            }
        }
        // give 500 status back if there is any error
        catch(err) {
            console.log(err);
            status = 500;
            result.status = status;
            result.error = err;
            res.status(status).send(result);
        }
    },
    find: async (req, res) => {
        let result = {};
        let status = 200;
        try {
            const returnedRes = await Products.find({ ...req.query }).exec();
            if (returnedRes) {
                result.status = status;
                result.result = returnedRes;
                res.status(status).send(result);
            }
        }
        // give 500 status back if there is any error
        catch(err) {
            status = 500;
            result.status = status;
            result.error = err;
            res.status(status).send(result);
        }
    },
    create: async (req, res) => {
        const _Products = new Products(req.body);
        let result = {};
        let status = 201;
        try {
            const returnedRes = await _Products.save();
            if (returnedRes) {
                result.status = status;
                result.result = returnedRes;
                res.status(status).send(result);
            }
        }
        // give 500 status back if there is any error
        catch(err) {
            status = 500;
            result.status = status;
            result.error = err;
            res.status(status).send(result);
        }
    },
    updateByCode: async (req, res) => {
        const { code } = req.params;
        const body = req.body;
        let result = {};
        let status = 203;
        try {
            const returnedRes = await Products.updateOne({ code: code }, body);
            if (returnedRes) {
                result.status = status;
                result.result = returnedRes;
                res.status(status).send(result);
            }
        }
        // give 500 status back if there is any error
        catch(err) {
            status = 500;
            result.status = status;
            result.error = err;
            res.status(status).send(result);
        }
    },
    deleteByCode: async(req, res) => {
        const { code } = req.params;
        let result = {};
        let status = 200;
        try {
            // check whether the code is given, if not then can not find the right data to delete
            if (!code) {
                status = 500;
                result.status = status;
                result.error = 'Unable to delete a non-exist product';
                res.status(status).send(result);
            }
            // find the unique data by the given code, if does exist then delete it by it's _id
            const findProduct = await Products.findOne({ code: code }).exec();
            if (findProduct) {
                // delete the data by the _id
                const returnedRes = await Products.deleteOne({ _id:  new ObjectId(findProduct._id) });
                if (returnedRes) {
                    result.status = status;
                    result.result = returnedRes;
                    res.status(status).send(result);
                }   
            }
            // give 500 status back when we can not find the data
            else {
                status = 500;
                result.status = status;
                result.error = 'Unable to delete a non-exist product';
                res.status(status).send(result);
            }
        }
        catch(err) {
            // give 500 status back if there is any error
            status = 500;
            result.status = status;
            result.error = err;
            res.status(status).send(result);
        }
    }
}

module.exports = controller;