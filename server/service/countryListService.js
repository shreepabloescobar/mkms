const axios = require("axios");

const fs = require("fs");
const BASE_URL = process.env.OTP_VALIDATION_URL;


const getCountryList = async (req,res) => {
    var response
    try{
        await fs.readFile("./constants/country_list_codes.json","utf8",(err,out)=>{
                if(err){
                    response = {"errorCode" : 500, "message":"Bad Request "+ err.message}
                    return res.status(500).json(response)
                }
                else{
                    response = {"status" : 200,"message": "Success", "data": JSON.parse(out)}
                    return res.status(200).json(response)
                }              
        })
    }catch(err){
        console.log(err)
    }
};

module.exports = {
    getCountryList,
}