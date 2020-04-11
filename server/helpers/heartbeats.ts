import knex from "../../knex";
import { getHighestEvent } from "./helpers";

interface HeartbeatData {
    userid: number,
    timestart: number,
    timeend: number,
    editor: string,
    project: string,
    language: string,
    file: string,
    eventid: number
}

const newHeartbeat = async (userid: number, editor: string, project: string, language: string, file: string): Promise<boolean> => {
    const currentTime = Date.now();
    console.log(`${userid}|${editor}|${project}|${language}|${file}|${currentTime}|${currentTime - 300000}`);
    const recentEvent = await knex("events")
        .where({
            userid,
            editor,
            project,
            language,
            file
        })
        .andWhere(
            "timeend", ">", (currentTime - 300000)
        )
        .andWhere(
            "timeend", "<", currentTime
        )
        .first()
        .catch(e => {
            throw e;
        });
    if (recentEvent) {
        await knex("events")
            .where({
                eventid: recentEvent.eventid
            })
            .update({
                timeend: currentTime
            })
            .then(() => {
                return true;
            })
            .catch(() => {
                return false;
            });
        return false;
    } else {
        const heartbeat = {
            userid,
            timestart: currentTime,
            timeend: currentTime + 300000,
            editor,
            project,
            language,
            file,
            eventid: await getHighestEvent()
        } as HeartbeatData;
        await knex("events")
            .insert(heartbeat)
            .then(() => {
                return true;
            })
            .catch(() => {
                return false;
            });
        return false;
    }
};

export { newHeartbeat, HeartbeatData }
