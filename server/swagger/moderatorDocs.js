const moderatorDocs = {
    "paths": {
        "/moderator/text": {
            "post": {
                "tags": [
                    "Moderators"
                ],
                "summary": "Text moderation API",
                "parameters": [],
                "requestBody": {
                    content: {
                        'application/json': {
                            schema: {
                                type: "object",
                                properties: {
                                    text_data: {
                                        type: "string"
                                    }
                                },
                                required:["text_data"]
                            }
                        }
                    },
                },
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "object"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "type": "object"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "type": "object"
                        }
                    },
                },

            }
        },
        "/moderator/image": {
            "post": {
                "tags": [
                    "Moderators"
                ],
                "summary": "Image moderation API",
                "parameters": [],
                "requestBody": {
                    content: {
                        'multipart/form-data': {
                            schema: {
                                type: "object",
                                properties: {
                                    file: {
                                        type: "string",
                                        format: "binary",
                                    }
                                },
                                required:["file"]
                            }
                        }
                    },
                },
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "object"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "type": "object"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "type": "object"
                        }
                    },
                },
            }
        },
    }
}

module.exports = {
    moderatorDocs
}