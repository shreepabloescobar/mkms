const moment = require('moment');

const generateOtp = () => {
    let otp;
    otp = [1, 2, 3, 4].reduce(
        o => o + String(Math.floor(Math.random() * 10)),
        ''
    );
    return otp;
}

const formatDateOfBirth = (value) => {
    let newValue = "";
    if (moment(value, "DDMMYYYY").isValid()) {
        newValue = moment(value, "DDMMYYYY").format("DD-MM-YYYY");
    }
    else if (moment(value, "DD-MM-YYYY").isValid()) {
        newValue = moment(value, "DD-MM-YYYY").format("DD-MM-YYYY");
    }
    else if (moment(value, "DD/MM/YYYY").isValid()) {
        newValue = moment(value, "DD/MM/YYYY").format("DD-MM-YYYY");
    }

    return newValue;
};

module.exports = {
    generateOtp,
    formatDateOfBirth
}