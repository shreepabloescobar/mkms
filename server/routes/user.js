const Router = require('express-promise-router');
const router = Router({ mergeParams: true });

const controller = require('../controllers/user');

module.exports = () => {
	router.post('/login', controller.handleUserLogin);
	router.post('/create-rocket-chat-user', controller.createRocketChatUser);
	router.post('/login-rocket-chat', controller.handleUserLoginRocketChat);
	router.get('/resendOtp/:appId', controller.resendOtp);
	router.get('/welcome', controller.welcome);
	router.post('/welcomePost', controller.welcomePost);
	router.get('/getAllProfiles',controller.getAllProfiles);
	router.post('/getUserProfile',controller.getUserProfile);
	router.get('/addNewUser',controller.addNewUser)
	router.post('/getMKAppUsersDetails',controller.getMKAppUsersDetailsFnc);
	router.post('/create-mkms-student',controller.createMKMSStudentRelation);
	router.post('/update-mkms-student-on-boarding',controller.updateMKMSStudentOnBoarding);
	return router; 
}