import { getData, getEditorData, getLanguagesData, getProjectData } from "./data";
import { findTotalDuration } from "./helpers/datahelpers";

module.exports = (app) => {
    app.get("/api/user/:query/:userid/:midnight/:days", async (req, res) => {
        const query = req.params.query;
        const userid = Number(req.params.userid);
        const midnight = Number(req.params.midnight);
        const days = Number(req.params.days);
        if (query === "projects") {
            res.send(JSON.stringify(await getProjectData(userid, midnight, days)));
        } else if (query === "editors") {
            res.send(JSON.stringify(await getEditorData(userid, midnight, days)));
        } else if (query === "languages") {
            res.send(JSON.stringify(await getLanguagesData(userid, midnight, days)));
        } else if (query === "events") {
            res.send(JSON.stringify(await getData(userid, midnight, days)));
        } else if (query === "timeSpent") {
            res.send(JSON.stringify(await findTotalDuration(await getData(userid, midnight, days))));
        } else {
            res.send("Not valid");
        }
    });
};
