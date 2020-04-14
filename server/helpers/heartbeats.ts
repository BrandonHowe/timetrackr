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

async function* heartbeat (submit: boolean, userid: number, editor: string, project: string, language: string): AsyncGenerator<boolean> {
    let heartbeats = [];
    while (true) {
        if (submit === false) {
            const currentTime = Date.now();
            console.log(`${userid}|${editor}|${project}|${language}|${currentTime}|${currentTime - 300000}`);
            const recentEvent = heartbeats.find(l => {
                if (l.userid === userid && l.editor === editor && l.project === project && l.language === language) {
                    if (l.timeend > currentTime) {
                        return l.timeend < currentTime + 300000;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            });
            if (recentEvent > -1) {
                heartbeats.map(l => {
                    if (l.eventid === recentEvent.eventid) {
                        l.timeend = currentTime + 300000;
                    }
                });
                yield true;
            } else {
                const heartbeat = {
                    userid,
                    timestart: currentTime,
                    timeend: currentTime + 300000,
                    editor,
                    project,
                    language,
                    eventid: await getHighestEvent()
                } as HeartbeatData;
                heartbeats.map(l => {
                    if (l.timeend > currentTime) {
                        l.timeend = currentTime;
                    }
                });
                heartbeats.push(heartbeat);
                yield true;
            }
        } else {
            await knex("events")
                .insert(heartbeats)
                .then(() => {
                    heartbeats = [];
                    return true;
                })
                .catch(() => {
                    return false;
                });
        }
    }
}

export { heartbeat, HeartbeatData }
