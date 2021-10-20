"use strict";
const axios = require('axios');
const request = require("request");
const fs = require('fs');
const wl = require('../config/whitelist');


/**
 * 
 * @param {*} textData 
 * @returns 
 */
exports.processTextModeration = (textData) => {
    return new Promise((resolve, reject) => {
        try {
            if (textData != null && textData != undefined && textData != "") {
                var result = {
                    status: 200,
                    nsfw: false,
                    original_text: textData
                };
                //Check text is available in the whitelist
                const whiteListResult = wl.WHITELIST.findIndex(item => textData.toLowerCase() === item.toLowerCase());

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
                textDataArray.map(function(text) {
                    options.form.text_data = text;
                    request(options, function(error, response, body) {
                        if (error) {
                            return reject(error);
                        };
                        const responseData = JSON.parse(body);
                        const outputDataObj = responseData.status[0].response.output[0].classes;
                        if (outputDataObj != undefined && outputDataObj != "" && outputDataObj != null) {
                            const maxNSFWCount = Math.max.apply(Math, outputDataObj.map(function(o) { return o.score; }));
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
                        return resolve(result);
                    });
                });
            }
        } catch (error) {
            return reject(error);
        }
    });
};

exports.processTextModerationOld = (textData) => {
    return new Promise((resolve, reject) => {
        try {
            if (textData != null && textData != undefined && textData != "") {
                const textDataArray = textData.match(/(.|[\r\1024]){1,1024}/g);
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token QG4ccCk1j3jNk7gnx4uDDJ0IN7RlWSu9'
                };
                var result = {
                    status: 200,
                    nsfw: false,
                    original_text: textData
                };
                textDataArray.map(function(text) {
                    const data = {
                        text_data: text
                    };
                    axios.post('https://api.thehive.ai/api/v2/task/sync', data, {
                        headers: headers
                    }).then(function(response) {
                        const outputDataObj = response.data.status[0].response.output[0].classes;
                        if (outputDataObj != undefined && outputDataObj != "" && outputDataObj != null) {
                            const maxNSFWCount = Math.max.apply(Math, outputDataObj.map(function(o) { return o.score; }));
                            const customClasses = response.data.status[0].response.custom_classes.length;
                            const textFilters = response.data.status[0].response.text_filters.length;
                            if (maxNSFWCount > 0 || customClasses > 0 || textFilters > 0) {
                                result.status = response.status;
                                result.nsfw = true;
                                result.original_text = textData;
                                result.response = response.data.status[0].response;
                                return resolve(result);
                            }
                        }
                        return resolve(result);
                    }).catch(error => {
                        console.log("1Error=========>", error);
                        return reject(JSON.stringify(error));
                    });
                });
            }
        } catch (error) {
            console.log("2ERROR===============", error)
            return reject(JSON.stringify(error));
        }
    });
};

exports.processImageModeration = (mediaPath) => {
    return new Promise((resolve, reject) => {
        try {
            if (mediaPath != null && mediaPath != undefined && mediaPath != "") {
                var options = {
                    method: 'POST',
                    url: 'https://api.thehive.ai/api/v2/task/sync',
                    headers: {
                        accept: 'application/json',
                        Authorization: 'Token D3dScP7IoQlSP6IR2lVRgdwhsDxTEQbz'
                    },
                    form: {}
                };
                const formRequest = request(options, function(error, response, body) {
                    if (error) {
                        return reject(error);
                    }
                    console.log("response=======================>", response);
                    return resolve(body);
                });
                var form = formRequest.form();
                form.append('media', fs.createReadStream(mediaPath));
            }
        } catch (error) {
            console.log("2ERROR===============", error)
            return reject(JSON.stringify(error));
        }
    });
};