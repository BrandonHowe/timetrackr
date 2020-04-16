import knex from "../../knex";
import { getHighestEvent } from "./helpers";

interface HeartbeatData {
    userid: number,
    timestart: number,
    timeend: number,
    editor: string,
    project: string,
    language: string,
    eventid: number
}

const heartbeat = async (userid, editor, project, language) => {
    const currentTime = Date.now();
    const eventExists = await knex("events")
        .where({
            userid,
            editor,
            project,
            language
        })
        .andWhere("timeend", ">", currentTime)
        .andWhere("timeend", "<", currentTime + 300000)
        .first()
        .catch(e => {
            throw e;
        });
    console.log(`${currentTime}|${currentTime + 300000}|${userid}|${editor}|${project}|${language}|${!!eventExists}`);
    if (eventExists) {
        await knex("events")
            .update({
                timeend: currentTime + 300000
            })
            .where({
                userid,
                editor,
                project,
                language
            })
            .andWhere("timeend", ">", currentTime)
            .catch(e => {
                throw e;
            });
    } else {
        await knex("events")
            .update({
                timeend: currentTime
            })
            .where({
                userid
            })
            .andWhere("timeend", ">", currentTime)
            .catch(e => {
                throw e;
            });
        await knex("events")
            .insert({
                userid,
                editor,
                project,
                language,
                timestart: currentTime,
                timeend: currentTime + 300000,
                eventid: await getHighestEvent()
            })
            .catch(e => {
                throw e;
            })
    }
};

export { heartbeat, HeartbeatData }
