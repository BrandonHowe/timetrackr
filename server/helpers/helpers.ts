import knex from "../../knex";

const doesUserExist = async (username: string): Promise<Boolean> => {
    const userList = await knex("users")
        .where({username})
        .first()
        .catch(e => {
            throw e;
        });
    return !!userList;
};

const getHighestEvent = async (): Promise<number> => {
    const eventIdList = await knex("events")
        .select("eventid")
        .catch(e => {
            throw e;
        });
    return eventIdList.length > 0 ? Math.max(...Array.from(eventIdList, l => l.eventid)) + 1 : 1;
};

const getHighestUserId = async (): Promise<number> => {
    const userIdList = await knex("users")
        .select("userid")
        .catch(e => {
            throw e;
        });
    return userIdList.length > 0 ? Math.max(...userIdList) + 1 : 1;
};

const getIdBySeshkey = async (seshkey: string): Promise<number> => {
    const user = await knex("users")
        .where({
            seshkey
        })
        .first()
        .catch(e => {
            throw e;
        });
    return user ? user.userid : -1;
};

export { doesUserExist, getHighestEvent, getHighestUserId, getIdBySeshkey }
