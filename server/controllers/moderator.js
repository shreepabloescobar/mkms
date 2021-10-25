const service = require('../service/moderatorService');
const logger = require('../service/logger')('Moderator');
const multiparty = require("multiparty");
const { isEmpty } = require('lodash');

/**
 * @name textModeration
 * @param textData
 */
exports.textModeration = (req, res) => {
	return new Promise((resolve, reject) => {
		const textData = req.body.text_data;
		if (textData != null && textData != undefined && textData != "") {
			service.processTextModeration(textData)
				.then((moderationResult) => {
					return res.send(moderationResult);
				})
				.catch((error) => {
					logger.info("Error at text moderation", error);
					return res.status(400).json(error);
				});
		} else {
			logger.info("No text was submitted. Please submit text_data.");
			return res.status(400).json({
				status: 400,
				message: "No text was submitted. Please submit text_data."
			});
		}
	});
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.imageModeration = (req, res) => {
	return new Promise((resolve, reject) => {
		let form = new multiparty.Form();
		form.parse(req, async function (err, fields, files) {
			/* Check weather user upload company logo or not */
			if (!isEmpty(files) && files.file[0].originalFilename != null && files.file[0].originalFilename != undefined && files.file[0].originalFilename != '') {
				let file = files.file[0];
				let tmpPath = file.path;
				service.processImageModeration(tmpPath)
					.then((moderationResult) => {
						return res.send(moderationResult);
					})
					.catch((error) => {
						logger.info("Error at image moderation", error);
						return res.status(400).json(error);
					});
			} else {
				logger.info("No image was submitted. Please submit image file.");
				return res.status(400).json({
					status: 400,
					message: "No image was submitted. Please submit image file."
				});
			}
		});
	});
};

