const controller = require('../controllers/user');

module.exports = (router) => {
    router.route('/user/:account')
        .get(controller.findByAccount)
        .delete(controller.deleteByAccount);
    router.route('/user/register').post(controller.register);
    router.route('/user/login').post(controller.login);
}