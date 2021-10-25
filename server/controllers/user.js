const { UeEmployee } = require("@byjus-orders/nexemplum/ums");

const getAgentDetails = async (req, res) => {
	let { email } = req.body;

	try {
		const employeeDetails = await UeEmployee.findOne({ email });
		res.status(200).json({
			data: employeeDetails,
		});
	} catch (error) {
		logger.error("Error in getting getEmployeeDetails", error);
		return res.status(500).json({ message: "Error in getting details of the employee" });
	}
}

module.exports = {
	getAgentDetails
}
