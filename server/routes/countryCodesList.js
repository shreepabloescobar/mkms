const Router = require('express-promise-router');
const router = Router({ mergeParams: true });

const service = require("../service/countryListService")

module.exports = () => {
        router.get("/get",service.getCountryList)
        return router;
}