/* Reference Docs - https://docs.google.com/document/d/1Mxr8AIHsg1zRNmvYICq97aBHoBD0rdV_YV2LlFJyeAg/edit */

const sfDocs = {
    "paths": {
        "/user/welcome": {
            "get": {
                "tags": [
                    "Salesforce"
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
                    "Salesforce"
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
        "/user/login-rocket-chat": {
            "post": {
                "tags": [
                    "Salesforce"
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
    }
}

module.exports = {
    sfDocs
}