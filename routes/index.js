// const products = require('./products');
const user = require('./user');

module.exports = (router) => {
    // products(router);
    user(router);
    return router;
}