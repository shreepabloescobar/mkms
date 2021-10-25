const Router = require('express-promise-router');
const router = Router({ mergeParams: true });

const controller = require('../controllers/user');

module.exports = () => {
	router.post('/getAgentDetails', controller.getAgentDetails);
	return router;
}