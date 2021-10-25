const validateDocs = {
    "paths": {
        "/validate/otp": {
            "post": {
                "tags": [
                    "Validate"
                ],
                "summary": "Validate the OTP entered by customer",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/definitions/OtpVerification"
                            },
                            "example": {
                                "otp": "0734",
                                "appId": "92104848397137"
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "User Logged in successfully after OTP verification"
                    },
                    "400": {
                        "description": "If the OTP entered is wrong, error is thrown.Also the OTP generated is valid for 30 mins only,so if the use tries to enter Expired OTP,error would be thrown!"
                    }
                }
            }
        }, "/validate/deDupAccountCheck": {
            "post": {
                "tags": [
                    "Validate"
                ],
                "summary": "De-Dup Check for Account Details",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/definitions/deDupAccountCheck"
                            },
                            "example": {
                                "accountNumber": "9898989898",
                                "ifsc": "SBIN98876"
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Dup Check Passed for the account details"
                    },
                    "400": {
                        "description": "Dup Check Failed for the account details provided"
                    }
                }
            }
        }, "/validate/pennyDropCheck": {
            "post": {
                "tags": [
                    "Validate"
                ],
                "summary": "Penny Drop Check for Account Details",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/definitions/pennyDropCheck"
                            },
                            "example": {
                                "accountNumber": "9898989898",
                                "ifsc": "SBIN98876",
                                "appId": "9876543212",
                                "accountHolderName": "barak obama"

                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Penny Drop Success for the account Details"
                    },
                    "400": {
                        "description": "Penny Drop Failed for the account Details, Error will be thrown"
                    }
                }
            }
        }
    },
    "definitions": {
        "OtpVerification": {
            "required": [
                "mobileNo"
            ],
            "properties": {
                "mobileNo": {
                    "type": "integer"
                }
            }
        },
        "deDupAccountCheck": {
            "required": [
                "accountNumber",
                "ifsc"
            ],
            "properties": {
                "accountNumber": {
                    "type": "string"
                },
                "ifsc": {
                    "type": "string"
                }
            }
        },
        "pennyDropCheck": {
            "required": [
                "accountNumber",
                "ifsc",
                "appId",
                "accountHolderName"
            ],
            "properties": {
                "accountNumber": {
                    "type": "string"
                },
                "ifsc": {
                    "type": "string"
                },
                "appId": {
                    "type": "string"
                },
                "accountHolderName": {
                    "type": "string"
                }
            }
        }
    }

}

module.exports = {
    validateDocs
}