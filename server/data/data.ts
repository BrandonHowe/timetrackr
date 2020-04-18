import knex from "../../knex";
import { HeartbeatData } from "../helpers/heartbeats";

const getData = async (userid: number, midnight: number, days: number = 1): Promise<HeartbeatData[]> => {
    const lastMidnight = midnight - (86400000 * days);
    return <HeartbeatData[]>await knex("events")
        .where({userid})
        .andWhere("timestart", "<", midnight)
        .andWhere("timeend", ">", lastMidnight)
        .catch(e => {
            throw e;
        });
};

const getDataDays = async (userid: number, midnight: number, days: number = 1): Promise<HeartbeatData[][]> => {
    const lastMidnight = midnight - (86400000 * days);
    const events = await getData(userid, midnight, days);
    const eventObj = events.reduce<Map<number, HeartbeatData[]>>((acc, cur) => {
        if (acc[Math.floor((cur.timestart - lastMidnight) / 86400000)]) {
            acc[Math.floor((cur.timestart - lastMidnight) / 86400000)].push(cur);
        } else {
            acc[Math.floor((cur.timestart - lastMidnight) / 86400000)] = [cur];
        }
        return acc;
    }, new Map());
    for (let i = 0; i < days; i++) {
        if (!eventObj[i]) {
            eventObj[i] = [];
        }
    }
    return Object.values(eventObj);
};

const getLanguagesData = async (userid: number, midnight: number, days: number = 1): Promise<Record<string, number>> => {
    const events = await getData(userid, midnight, days);
    let data = {};
    for (const event of events) {
        const currentLang = event.language === "PLAIN_TEXT" ? "Other" : event.language;
        if (data[currentLang]) {
            data[currentLang] += event.timeend - event.timestart;
        } else {
            data[currentLang] = event.timeend - event.timestart;
        }
    }
    return data;
};

const getEditorData = async (userid: number, midnight: number, days: number = 1): Promise<Record<string, number>> => {
    const events = await getData(userid, midnight, days);
    let data = {};
    for (const event of events) {
        if (data[event.editor]) {
            data[event.editor] += event.timeend - event.timestart;
        } else {
            data[event.editor] = event.timeend - event.timestart;
        }
    }
    return data;
};

const getProjectData = async (userid: number, midnight: number, days: number = 1): Promise<Record<string, number>> => {
    const events = await getData(userid, midnight, days);
    let data = {};
    for (const event of events) {
        if (data[event.project]) {
            data[event.project] += event.timeend - event.timestart;
        } else {
            data[event.project] = event.timeend - event.timestart;
        }
    }
    return data;
};

export { getData, getDataDays, getLanguagesData, getEditorData, getProjectData }
