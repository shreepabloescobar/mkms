var jwt = require('jsonwebtoken');

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

const validateAuthToken = (req,res,next)=>{
    const { authToken } = req.query || req.body || req.headers
    if(authToken){
        jwt.verify(authToken, process.env.SECRET, (err,decoded)=>{
            if(err){
                res.status(401).json({message:"Unauthorized: Token Expired or Invalid"})
            }else{
                console.log("Token Verification success")
                next();
            }
        });
    }
    else{
        res.status(401).json({message:"Token Missing"})
    } 
}

module.exports = {
    authenticate,
    validateAuthToken
}