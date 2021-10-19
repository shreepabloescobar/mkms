const authenticate = (req, res, next) => {
    const { clientid = '', clientsecret = '' } = req && req.headers;
    if (clientid && clientsecret) {
        if (clientid == "12245" && clientsecret == "abd344#+") {
            next();
        } else {
            res.status(401).json({
                status: "failure",
                message: "Invalid credentials!"
            })
        }
    } else {
        res.status(401).json({
            status: "failure",
            message: "Invalid credentials!"
        })
    }
}

module.exports = {
    authenticate
}