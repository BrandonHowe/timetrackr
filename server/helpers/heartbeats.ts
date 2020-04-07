import knex from "../../knex";
import { getHighestEvent } from "./helpers";

interface HeartbeatData {
    userid: number,
    timestart: number,
    timeend: number,
    editor: string,
    project: string,
    file: string,
    language: string,
    eventid: number
}

const newHeartbeat = async (userid: number, editor: string, project: string, file: string, language: string) => {
    const currentTime = Date.now();
    const recentEvent = await knex("events")
        .where({
            userid,
            editor,
            project,
            file,
            language
        })
        .where(
            "timeend", ">", (currentTime - 300000)
        )
        .first()
        .catch(e => {
            throw e;
        });
    if (recentEvent) {
        await knex("events")
            .where({
                userid,
                editor,
                project,
                file,
                language
            })
            .where("timeend", ">", (currentTime - 30000))
            .first()
            .update({
                timeend: currentTime
            })
            .catch(e => {
                throw e;
            })
    } else {
        const heartbeat = {
            userid,
            timestart: currentTime - 1,
            timeend: currentTime,
            editor,
            project,
            file,
            language,
            eventid: await getHighestEvent()
        } as HeartbeatData;
        await knex("events")
            .insert(heartbeat)
            .catch(e => {
                throw e;
            });
    }
};

export { newHeartbeat }
