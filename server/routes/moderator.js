const Router = require('express-promise-router');
const router = Router({ mergeParams: true });
const controller = require('../controllers/moderator');

module.exports = () => {
	router.post('/text', controller.textModeration);
	router.post('/image', controller.imageModeration);
	return router;
}