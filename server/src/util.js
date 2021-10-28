const { find } = require("lodash");

const { Salesforce } = require("@byjus-orders/tyrion-plugins");
const { ByjusConfig } = require("@byjus-orders/nexemplum/oms");

const setupSFToken = async () => {
    const SalesforceConfig = await ByjusConfig.findOne({
        formattedAppName: "SALESFORCE",
        formattedModuleName: "SALESFORCE_API_CONFIG",
    });

    if (SalesforceConfig) {
        const { configs = [] } = SalesforceConfig;
        const config = find(configs, { environment: process.env.NODE_ENV, orgName: "byjus" });
        const { authUrl, userName, password, clientId, clientSecret } = config;

        const sfClient = new Salesforce({
            authUrl,
            userName,
            password,
            clientId,
            clientSecret,
        });
        await sfClient.init();
        return sfClient;
    }

    throw new Error(`Salesforce configuration is missing`);
};

module.exports = {
    setupSFToken
};