const axios = require("axios");
const moderatorService = require('../service/moderatorService');
const {
    createProxyMiddleware,
    responseInterceptor,
} = require("http-proxy-middleware");
const moderation = {};

async function onProxyReq(proxyReq, req, res) {
    // add custom header to request
    // proxyReq.setHeader('x-added', 'foobar');
    // or log the req
    console.log(proxyReq.path);
    if (!req.body || !Object.keys(req.body).length) {
        return;
    }
    const contentType = proxyReq.getHeader("Content-Type");
    const writeBody = (bodyData) => {
        proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
    };
    if (contentType === "application/json") {
        writeBody(JSON.stringify(req.body));
    }
    if (contentType === "application/x-www-form-urlencoded") {
        writeBody(querystring.stringify(req.body));
    }
}

const resIncpt = async(responseBuffer, proxyRes, req, res) => {
    const response = responseBuffer.toString("utf8"); // convert buffer to string
    console.log(response);
    var tmp = JSON.parse(response);
    tmp["InterceptorName"] = "Vishal";
    console.log("---------------");
    console.log(tmp);
    return JSON.stringify(tmp); // manipulate response and return the result
};

moderation.apiProxyMiddleware = createProxyMiddleware({
    target: process.env.TARGET_URL,
    changeOrigin: true,
    onProxyReq,
    selfHandleResponse: true,
    onProxyRes: responseInterceptor(resIncpt),
})

moderation.moderationMiddleWare = async(req, res, next) => {
    console.log(req.path);
    // if it is the route to post message on channel only then moderation logic will trigger
    if (req.path.includes("/chat.postMessage")) {
        try {
            return new Promise((resolve, reject) => {
                moderatorService.checkTextModeration(req,res)
                    .then((result) => {
                        // if the text is ok it retunrs false and we are good to proceed for publishing text
                        if (!result["nsfw"]) {
                            next();
                        } else {
                            // if the text is malicious or offesvie it return back with error.
                            return res.status(400).send(result);
                        }
                    }).catch((error) => {
                        res.send(error);
                    });
            });
        } catch (err) {
            console.log(err);
        }
    } else { // for all other apis no moderation will trigger
        next();
    }
};

module.exports = moderation;