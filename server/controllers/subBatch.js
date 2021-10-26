const { createSubBatchService } = require('../service/subBatchService');
const logger = require('../service/logger')('User');


const createSubBatch = async (req, res) => {
    try {
        
        const response = await createSubBatchService();

        if (response.status === 'success') {
            logger.info(`sub batch data saved successfully.`);
            return res.status(200).json(response);
        } else {
            logger.info(`sub batch data not saved.`);
            return res.status(400).json(response);
        }

    } catch (error) {
        logger.info("Error while user login", error);
        return res.status(400).json({
            status: 'failure',
            message: (error.message || "Error while user login")
        });
    }
}


module.exports = {
    createSubBatch
}
