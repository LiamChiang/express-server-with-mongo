const controller = require('../controllers/user');

module.exports = (router) => {
    router.route('/user/register').post(controller.add);

    router.route('/user/login').post(controller.login);
}