const logger = require('./logger')('Moderator Service');
const request = require("request");
const whitelist = require("./utils/whitelist");
const fs = require("fs");
const mc = require("./utils/moderatorClasses");
const { isEmpty } = require('lodash');

/**
 * 
 * @param {*} textData 
 * @returns 
 */
exports.processTextModeration = (textData) => {
    return new Promise(async (resolve, reject) => {
        try {
            var result = {
                status: 200,
                nsfw: false,
                message: "success",
                original_text: textData
            };

            //Check text is available in the whitelist
            const whiteListResult = await whitelist.TEXT.findIndex(item => textData.toLowerCase() === item.toLowerCase());

            //If yes return that text is safe for the work
            if (whiteListResult > 0) {
                return resolve(result);
            }

            //If text is long divide into 1024 character each
            const textDataArray = textData.match(/(.|[\r\1024]){1,1024}/g);

            var options = {
                method: 'POST',
                url: 'https://api.thehive.ai/api/v2/task/sync',
                headers: {
                    accept: 'application/json',
                    authorization: 'Token QG4ccCk1j3jNk7gnx4uDDJ0IN7RlWSu9'
                },
                form: {}
            };
            textDataArray.map(function (text) {
                options.form.text_data = text;
                request(options, function (error, response, body) {
                    if (error) {
                        return reject(error);
                    };
                    const responseData = JSON.parse(body);
                    if (!isEmpty(responseData.status)) {
                        const outputDataObj = responseData.status[0].response.output[0].classes;
                        if (outputDataObj != undefined && outputDataObj != "" && outputDataObj != null) {
                            const maxNSFWCount = Math.max.apply(Math, outputDataObj.map(function (o) { return o.score; }));
                            const customClasses = responseData.status[0].response.custom_classes.length;
                            const textFilters = responseData.status[0].response.text_filters.length;
                            if (maxNSFWCount > 0 || customClasses > 0 || textFilters > 0) {
                                result.status = responseData.code;
                                result.nsfw = true;
                                result.original_text = textData;
                                result.response = responseData.status[0].response;
                                return resolve(result);
                            }
                        }
                    } else {
                        // If api returns 400
                        logger.info("Error in text moderation api", responseData.message);
                        result.nsfw = true;
                        result.message = responseData.message;
                        return resolve(result);
                    }
                    return resolve(result);
                });
            });


        } catch (error) {
            logger.info("Error in text moderation api", error);
            result.nsfw = true;
            result.message = error;
            return resolve(result);
        }
    });
};
/**
 * 
 * @param {*} mediaPath 
 * @returns 
 */
exports.processImageModeration = (mediaPath) => {
    return new Promise(async (resolve, reject) => {
        await processImage(mediaPath).then(async (result) => {
            return resolve(result);
        });
    });
};

/**
 * 
 * @param {*} mediaPath 
 * @returns 
 */
async function processImage(mediaPath) {
    return new Promise((resolve, reject) => {
        var result = {
            status: 200,
            nsfw: false,
            message: "success",
            media_path: mediaPath
        };
        var options = {
            method: 'POST',
            url: 'https://api.thehive.ai/api/v2/task/sync',
            headers: {
                Authorization: 'Token D3dScP7IoQlSP6IR2lVRgdwhsDxTEQbz'
            },
            form: {}
        };
        const formRequest = request(options, async function (error, response, body) {
            if (error) {
                return reject(error);
            }
            const responseData = JSON.parse(body);
            if (!isEmpty(responseData.status)) {
                const outputDataObj = responseData.status[0].response.output[0].classes;
                var yesText = 0;
                var yesOverlayText = 0;
                var maxNSFWScore = 0;
                if (outputDataObj != undefined && outputDataObj != "" && outputDataObj != null) {
                    outputDataObj.map(function (o) {
                        if (mc.CLASSES.includes(o.class) === true) {
                            if (maxNSFWScore < o.score) {
                                maxNSFWScore = o.score
                            }
                        }
                        if (o.class == "text") {
                            yesText = o.score;
                        }
                        if (o.class == "yes_overlay_text") {
                            yesOverlayText = o.score;
                        }
                    });
                    if (maxNSFWScore > mc.THRESHOLD_VALUE) {
                        result.status = responseData.code;
                        result.nsfw = true;
                        result.response = responseData.status[0].response;
                        return resolve(result);
                    }

                    //pass image to OCR
                    if (yesText > mc.TEXT_THRESHOLD_VALUE || yesOverlayText > mc.TEXT_THRESHOLD_VALUE) {
                        await processImageOCR(mediaPath).then(async (result) => {
                            return resolve(result);
                        });
                    }

                }
                return resolve(result);
            } else {
                // If api returns 400
                logger.info("Error in image moderation api", responseData.message);
                result.nsfw = true;
                result.message = responseData.message;
                return resolve(result);
            }
        });
        var form = formRequest.form();
        form.append('media', fs.createReadStream(mediaPath));

    });
}

/**
 * 
 * @param {*} mediaPath 
 * @returns 
 */
async function processImageOCR(mediaPath) {
    return new Promise((resolve, reject) => {
        var result = {
            status: 200,
            nsfw: false,
            message: "success",
            media_path: mediaPath
        };
        var options = {
            method: 'POST',
            url: 'https://api.thehive.ai/api/v2/task/sync',
            headers: {
                Authorization: 'Token gv4VQskuIrgJKYO1dCtEcCcAQRy0T0Is'
            },
            form: {}
        };

        const formRequest2 = request(options, async function (error, response, body) {
            if (error) {
                return reject(error);
            }
            const ocrResponseData = JSON.parse(body);
            if (!isEmpty(ocrResponseData.status)) {
                const ocrOutputDataObj = ocrResponseData.status[0].response.output[0].frame_results;
                if (ocrOutputDataObj != undefined && ocrOutputDataObj != "" && ocrOutputDataObj != null) {
                    ocrOutputDataObj.map(function (output) {
                        const maxNSFWScore = Math.max.apply(Math, output.classes.map(function (o) { return o.score; }));
                        const customClasses = output.custom_classes.length;
                        const textFilters = output.text_filters.length;
                        if (maxNSFWScore > 0 || customClasses > 0 || textFilters > 0) {
                            result.status = ocrResponseData.code;
                            result.nsfw = true;
                            result.media_path = mediaPath;
                            return resolve(result);
                        }
                    });
                }
                return resolve(result);
            } else {
                // If api returns 400
                logger.info("Error in image moderation ocr api", responseData.message);
                result.nsfw = true;
                result.message = responseData.message;
                return resolve(result);
            }
        });
        var form2 = formRequest2.form();
        form2.append('media', fs.createReadStream(mediaPath));

    });
}