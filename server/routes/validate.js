const Router = require('express-promise-router');
const router = Router({ mergeParams: true });

const controller = require('../controllers/validate');

module.exports = () => {
    router.post('/validateOtp', controller.validateOtp);
    router.post('/requestOtp', controller.requestOtp);
    // router.post('/validateOtp', controller.validateOtp);
    return router;
}