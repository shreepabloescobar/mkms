require('dotenv').config()

module.exports = {
    port: process.env.PORT || 9016,
    db: process.env.MONGODB_NUCLEUS_URI || 'MONGODB_NUCLEUS_URI',
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || 'SENDGRID_API_KEY',
    sms: {
        key: process.env.SMS_KEY || 'SMS_KEY',
        salt: process.env.SMS_SALT || 'SMS_SALT',
        serviceUrl: process.env.SMS_SERVICE_URL || 'https://byjus-notification-hub.herokuapp.com/api/v1/notification'
    },
    aws: {
        s3: {
            clientId: process.env.AWS_S3_CLIENT_ID || 'AWS_S3_CLIENT_ID',
            clientSecret: process.env.AWS_S3_CLIENT_SECRET || 'AWS_S3_CLIENT_SECRET',
            region: process.env.AWS_S3_REGION || 'ap-southeast-1',
            bucket: process.env.AWS_S3_BUCKET || 'AWS_S3_BUCKET'
        }
    }
}