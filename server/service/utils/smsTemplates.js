const { template } = require("lodash");

const templateMap = (data) => {
    const { otp = '', template = '', applicantFirstName = '', applicantLastName = '', spContactNo = '', hashCode = '' } = data;

    switch (template) {
        case 'loginOtp':
            return ` Dear ${applicantFirstName.toUpperCase()} ${applicantLastName.toUpperCase()}, OTP for logging into Byju's mobile application is ${otp}. If you are facing issues, please contact ${spContactNo}.\n${hashCode}`;
    }
}

const emailTemplate = (data) => {
    const { otp = '', applicantFirstName = '', template = '', applicantLastName = '', spContactNo = '' } = data;
    switch (template) {
        case 'loginOtp':
            return (
                `<p><h4>Dear ${applicantFirstName.toUpperCase()} ${applicantLastName.toUpperCase()},<h4></p> 

            <p>OTP for logging into Byju's mobile application is ${otp}. If you are facing issues, please contact ${spContactNo}.</p>
            <br>
             
            <div>
            Regards 
            <br>
            <br>
            Team Byju's
            </div>`
            )
    }
}

module.exports = {
    templateMap,
    emailTemplate
}