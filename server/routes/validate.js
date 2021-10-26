const Router = require('express-promise-router');
const router = Router({ mergeParams: true });

const controller = require('../controllers/validate');

module.exports = () => {
    //router.post('/otp', controller.validateOtp);
    router.post('/user/login',controller.doOtpLogin);
    router.post('/otp',controller.validateOtpOnLogin);
    return router;
}