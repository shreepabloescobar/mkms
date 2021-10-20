'use strict';
const moderatorController = require('../controllers/moderatorController');


 module.exports.checkTextModeration = (req, res) => {
     console.log(req.body);
    let textData = req.body.text;
    return new Promise((resolve, reject) => {
        moderatorController.processTextModeration(textData)
            .then((moderationResult) => {
                return resolve(moderationResult)
            })
            .catch((error) => {
                return reject(error);
            });
    });
};