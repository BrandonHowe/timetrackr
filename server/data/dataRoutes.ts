import { findTotalDuration } from "./helpers/datahelpers";
import { getData, getDataDays, getLanguagesData } from "./data";
import { HeartbeatData } from "../helpers/heartbeats";
const ColorHash = require("color-hash");

module.exports = (app) => {
    app.get("/userData/timeSpent/:userid/:midnight", async (req, res) => {
        const userid = Number(req.params.userid);
        const midnight = Number(req.params.midnight);
        const totalDuration = await findTotalDuration(await getData(userid, midnight));
        console.log(`Total duration: ${totalDuration}`);
        res.send(totalDuration.toString());
    });
    app.get("/userData/daysData/:userid/:midnight/:days", async (req, res) => {
        const userid = Number(req.params.userid);
        const midnight = Number(req.params.midnight);
        const days = Number(req.params.days);
        const daysArr = await getDataDays(userid, midnight, days);
        res.send(JSON.stringify(daysArr));
    });
    app.get("/userData/totalDaysData/:userid/:midnight/:days", async (req, res) => {
        const userid = Number(req.params.userid);
        const midnight = Number(req.params.midnight);
        const days = Number(req.params.days);
        const daysArr = await getDataDays(userid, midnight, days);
        const mappedArr = daysArr.map(l => {
            let total = 0;
            for (const event of l) {
                total += event.timeend - event.timestart;
            }
            return total;
        });
        res.send(JSON.stringify(mappedArr));
    });
    app.get("/userData/projectDaysData/:userid/:midnight/:days", async (req, res) => {
        const userid = Number(req.params.userid);
        const midnight = Number(req.params.midnight);
        const days = Number(req.params.days);
        const daysArr = await getDataDays(userid, midnight, days);
        const mappedArr = daysArr.map(l => {
            let total = {};
            for (const event of l) {
                if (total[event.project]) {
                    total[event.project] += event.timeend - event.timestart;
                } else {
                    total[event.project] = event.timeend - event.timestart;
                }
            }
            return total;
        });
        let result = [];
        mappedArr.map((l: Record<string, HeartbeatData>, idx) => {
            for (const i in l) {
                if (!l.hasOwnProperty(i)) {
                    continue;
                }
                const event = l[i];
                if (result.findIndex(l => l.label === i) !== -1) {
                    result[result.findIndex(l => l.label === i)].data[idx] += event;
                } else {
                    result.push({
                        label: i,
                        backgroundColor: new ColorHash().hex(i),
                        data: []
                    });
                    for (let j = 0; j < days; j++) {
                        result[result.length - 1].data.push(0);
                    }
                    result[result.length - 1].data[idx] = event;
                }
            }
        });
        res.send(JSON.stringify(result));
    });
    app.get("/userData/languageData/:userid/:midnight/:days", async (req, res) => {
        const userid = Number(req.params.userid);
        const midnight = Number(req.params.midnight);
        const days = Number(req.params.days);
        const data = await getLanguagesData(userid, midnight, days);
        let result = {
            datasets: [{
                label: "Languages",
                backgroundColor: [],
                data: []
            }],
            labels: []
        };
        for (const i in data) {
            if (!data.hasOwnProperty(i)) {
                continue;
            }
            result.datasets[0].data.push(data[i]);
            result.datasets[0].backgroundColor.push(new ColorHash().hex(i));
            result.labels.push(i);
        }
        res.send(JSON.stringify(result));
    });
};
