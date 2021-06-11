const controller = require('../controllers/products');

module.exports = (router) => router.route('/products').post(controller.add);