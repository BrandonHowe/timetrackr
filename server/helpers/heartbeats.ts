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
        .first()
        .catch(e => {
            throw e;
        });
    if (recentEvent) {
        console.log(`There is a recent event: old time: ${recentEvent.timeend} | new time: ${currentTime}`);
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
        console.log("New event");
        const heartbeat = {
            userid,
            timestart: currentTime - 1,
            timeend: currentTime,
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
