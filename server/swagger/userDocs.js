const userDocs = {
    "paths": {
        "/user/welcome": {
            "get": {
                "tags": [
                    "Users"
                ],
                "summary": "Welcome greeting from the api",
                "responses": {
                    "200": {
                        "description": "welcome" // How to add dynamic responses
                    }
                }
            }
        },
        "/user/welcomePost": {
            "post": {
                "tags": [
                    "Users"
                ],
                "summary": "Users Post Test API",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/definitions/UserLogin"
                            },
                            "example": {
                                "mobileNo": "9999999999"
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Success"
                    }
                }
            }
        },
        "/user/getMKAppUsersDetails": {
            "post": {
                "tags": [
                    "Users"
                ],
                "summary": "get MK App Users Details API",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/definitions/getMkAppUser"
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Success"
                    }
                }
            }
        },
        "/user/create-mkms-student": {
            "post": {
                "tags": [
                    "Users"
                ],
                "summary": "create-mkms-student API",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/definitions/createMkmsStudent"
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Success"
                    }
                }
            }
        },
        "/user/login-rocket-chat":{
            "post": {
                "tags": [
                    "Users"
                ],
                "summary": "Users rocket chat login",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/definitions/UserRocketChatLogin"
                            },
                            "example": {
                                "mobileNo": "9999999999"
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Success"
                    }
                }
            }
        }
    },
    "definitions":{
        "UserLogin":{
            "properties":{
                "mobileNo":{
                    "required":["true"],
                    "type":"number",
                    "example":"9999999999"
                }
            }
        },
        "getMkAppUser":{
            "properties":{
                "url":{
                    "required":["true"],
                    "type":"string",
                    "example":"getStudentDetails"
                },
                "phone":{
                    "required":["true"],
                    "type":"string",
                    "example":"2139391100"
                },
                "countryCode":{
                    "required":["true"],
                    "type":"string",
                    "example":"+91"
                }
            }
          },
          "createMkmsStudent":{
            "properties":{
                "rocket_user_id":{
                    "required":["true"],
                    "type":"string",
                    "example":"rocket_user_id-1"
                },
                "premium_id":{
                    "required":["true"],
                    "type":"Number",
                    "example":101
                },
                "user_type":{
                    "required":["true"],
                    "type":"string",
                    "example":"student"
                }
            }
          }
    }
}

module.exports = {
    userDocs
}