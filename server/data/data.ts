import knex from "../../knex";
import { HeartbeatData } from "../helpers/heartbeats";

const getData = async (userid: number, midnight: number): Promise<HeartbeatData[]> => {
    const prevMidnight = midnight - 86400000;
    console.log(`${prevMidnight}|${midnight}`);
    return <HeartbeatData[]>await knex("events")
        .where({userid})
        .andWhere("timestart", "<", midnight)
        .andWhere("timeend", ">", prevMidnight)
        .catch(e => {
            throw e;
        });
};

const getDataDays = async (userid: number, midnight: number, days: number = 1): Promise<HeartbeatData[][]> => {
    const lastMidnight = midnight - (86400000 * days);
    const events = <HeartbeatData[]>await knex("events")
        .where({userid})
        .andWhere("timestart", "<", midnight)
        .andWhere("timeend", ">", lastMidnight)
        .catch(e => {
            throw e;
        });
    let eventObj: Record<number, HeartbeatData[]> = {};
    for (let i in events) {
        const event = events[i];
        if (eventObj[Math.floor((event.timestart - lastMidnight) / 86400000)]) {
            eventObj[Math.floor((event.timestart - lastMidnight) / 86400000)].push(event);
        } else {
            eventObj[Math.floor((event.timestart - lastMidnight) / 86400000)] = [event];
        }
    }
    for (let i = 0; i < days; i++) {
        if (!eventObj[i]) {
            eventObj[i] = [];
        }
    }
    return Object.values(eventObj);
};

export { getData, getDataDays }
