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

export { getData }
