import { findTotalDuration } from "./helpers/datahelpers";
import { getData } from "./data";

module.exports = (app) => {
    app.get("/userData/timeSpent/:userid/:midnight", async (req, res) => {
        const userid = Number(req.params.userid);
        const midnight = Number(req.params.midnight);
        const totalDuration = await findTotalDuration(await getData(userid, midnight));
        console.log(`Total duration: ${totalDuration}`);
        res.send(totalDuration.toString());
    });
};
