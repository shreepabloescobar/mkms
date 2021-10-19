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
    }
}

module.exports = {
    userDocs
}