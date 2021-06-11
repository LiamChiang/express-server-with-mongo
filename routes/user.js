const controller = require('../controllers/user');

module.exports = (router) => {
    router.route('/user').post(controller.add);

    router.route('/user/login').post(controller.login);
}