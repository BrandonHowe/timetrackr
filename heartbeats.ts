import knex from "./knex";

interface HeartbeatData {
    userid: number,
    time: number,
    editor: string,
    project: string,
    file: string,
    language: string
}

const newHeartbeat = async (userid: number, editor: string, project: string, file: string, language: string) => {
    const heartbeat = {
        userid,
        time: Date.now(),
        editor,
        project,
        file,
        language
    } as HeartbeatData;
    await knex("events")
        .insert(heartbeat)
        .catch(e => {
            throw e;
        });
    return heartbeat;
};

export { newHeartbeat }
