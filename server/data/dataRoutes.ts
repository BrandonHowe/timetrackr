import { findTotalDuration } from "./helpers/datahelpers";
import { getData, getDataDays, getEditorData, getLanguagesData, getProjectData, getTotalOverDays } from "./data";
import { HeartbeatData } from "../helpers/heartbeats";

const ColorHash = require("color-hash");

module.exports = (app) => {
    app.get("/userData/timeSpent/:userid/:midnight", async (req, res) => {
        const userid = Number(req.params.userid);
        const midnight = Number(req.params.midnight);
        const totalDuration = await findTotalDuration(await getData(userid, midnight));
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
                        borderColor: new ColorHash({lightness: 0.48}).hex(i),
                        backgroundColor: new ColorHash().hex(i),
                        borderWidth: 2.5,
                        data: [],
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
                data: [],
            }],
            labels: [],
        };
        for (const i in data) {
            if (!data.hasOwnProperty(i)) {
                continue;
            }
            const currentIdx = i !== "PLAIN_TEXT" ? i : "Other";
            result.datasets[0].data.push(data[i]);
            result.datasets[0].backgroundColor.push(new ColorHash().hex(i));
            result.labels.push(currentIdx);
        }
        res.send(JSON.stringify(result));
    });
    app.get("/userData/editorData/:userid/:midnight/:days", async (req, res) => {
        const userid = Number(req.params.userid);
        const midnight = Number(req.params.midnight);
        const days = Number(req.params.days);
        const data = await getEditorData(userid, midnight, days);
        let result = {
            datasets: [{
                label: "Editors",
                backgroundColor: [],
                data: [],
            }],
            labels: [],
        };
        for (const i in data) {
            if (!data.hasOwnProperty(i)) {
                continue;
            }
            const currentIdx = i === "idea" ? "IntelliJ IDEA" : i;
            result.datasets[0].data.push(data[i]);
            result.datasets[0].backgroundColor.push(new ColorHash().hex(currentIdx));
            result.labels.push(currentIdx);
        }
        res.send(JSON.stringify(result));
    });
    app.get("/userData/projectData/:userid/:midnight/:days", async (req, res) => {
        const userid = Number(req.params.userid);
        const midnight = Number(req.params.midnight);
        const days = Number(req.params.days);
        const data = await getProjectData(userid, midnight, days);
        let result = {
            datasets: [{
                label: "Projects",
                backgroundColor: [],
                data: [],
            }],
            labels: [],
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
    app.get("/userData/timeTodayComparedToDays/:userid/:midnight/:days", async (req, res) => {
        const userid = Number(req.params.userid);
        const midnight = Number(req.params.midnight);
        const days = Number(req.params.days);
        const today = await getTotalOverDays(userid, midnight, 1);
        const average = Math.floor(await getTotalOverDays(userid, midnight, days) / days);
        const percent = Math.floor((today / average) * 100);
        res.send(JSON.stringify({
            datasets: [{
                label: "Time spent",
                backgroundColor: ["#1E90FF"],
                data: [percent, (100 - percent < 0 ? 0 : 100 - percent)],
            }],
            labels: ["Time coded today", "Time not coded"],
        }));
    });
};
