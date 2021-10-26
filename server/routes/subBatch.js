const Router = require('express-promise-router');
const router = Router({ mergeParams: true });

const controller = require('../controllers/subBatch');

module.exports = () => {
	router.post('/create', controller.createSubBatch);
	
	return router;
}