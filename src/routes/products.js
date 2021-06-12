const controller = require('../controllers/products');
const validateToken = require('../utils').validateToken;

module.exports = (router) => {
    router.route('/products')
        .get(validateToken, controller.find)
        .post(validateToken, controller.create);
    router.route('/products/:code')
        .get(validateToken, controller.findByCode)
        .put(validateToken, controller.updateByCode)
        .delete(validateToken, controller.deleteByCode);
};