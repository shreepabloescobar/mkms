const Router = require('express-promise-router');
const router = Router({ mergeParams: true });

const controller = require('../controllers/user');

module.exports = () => {
	router.post('/login', controller.handleUserLogin);
	router.get('/resendOtp/:appId', controller.resendOtp);
	router.get('/welcome', controller.welcome);
	router.post('/welcomePost', controller.welcomePost);
	return router;
}