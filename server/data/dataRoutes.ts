import { getDataDays } from "./data";

const ColorHash = require("color-hash");

module.exports = (app) => {
    app.get("/userData/projectDaysData/:userid/:midnight/:days", async (req, res) => {
        const userid = Number(req.params.userid);
        const midnight = Number(req.params.midnight);
        const days = Number(req.params.days);
        const daysArr = await getDataDays(userid, midnight, days);
        const result = daysArr.map(l => {
            let total = {};
            for (const event of l) {
                if (total[event.project]) {
                    total[event.project] += event.timeend - event.timestart;
                } else {
                    total[event.project] = event.timeend - event.timestart;
                }
            }
            return total;
        })
            .reduce<Record<string, any>[]>((acc, cur, idx) => {
            for (const i in cur) {
                if (!cur.hasOwnProperty(i)) {
                    continue;
                }
                const event = cur[i];
                if (acc.findIndex(l => l.label === i) !== -1) {
                    acc[acc.findIndex(l => l.label === i)].data[idx] += event;
                } else {
                    acc.push({
                        label: i,
                        borderColor: new ColorHash({lightness: 0.48}).hex(i),
                        backgroundColor: new ColorHash().hex(i),
                        borderWidth: 2.5,
                        data: [],
                    });
                    for (let j = 0; j < days; j++) {
                        acc[acc.length - 1].data.push(0);
                    }
                    acc[acc.length - 1].data[idx] = event;
                }
            }
            return acc;
        }, []);
        res.send(JSON.stringify(result));
    });
};
