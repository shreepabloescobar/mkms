const subBatchDocs = {
    "paths": {
        "/sub-batch/create": {
            "post": {
                "tags": [
                    "Sub-Batch"
                ],
                "summary": "Create a sub batch.",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/definitions/subBatchCreate"
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "welcome" // How to add dynamic responses
                    }
                }
            }
        }
    },
    "definitions":{
        "subBatchCreate":{
            "properties":{
                "sub_batch_id":{
                    "required":["true"],
                    "type":"number",
                    "example":1
                },
                "batch_id":{
                    "required":["true"],
                    "type":"number",
                    "example":101
                },
                "premium_accounts_id":{
                    "required":["true"],
                    "type":"array",
                    "example":[1001,1002,1003,1004]
                },
                "topic_details":{
                    "required":["true"],
                    "type":"array",
                    "example":[
                        {
                            "topic_id":1,
                            "name":"demo",
                            "subject":"time to play",
                            "type":"example",
                            "assessment_id":112,
                            "channel_id":"GENERAL"
                        }
                    ]
                }
            }
        }
    }
}

module.exports = {
    subBatchDocs
}