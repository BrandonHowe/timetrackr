import knex from "../knex";
import { doesUserExist, getHighestUserId } from "./helpers/helpers";
const bcrypt = require("bcrypt");
const crypto = require("crypto");

module.exports = (app) => {
    app.post('/login', async (req, res) => {
        const username = req.body.username;
        const password = req.body.password;
        const matchingUser = await knex("users")
            .where({username})
            .first()
            .catch(e => {
                throw e;
            });
        if (matchingUser) {
            const passMatches = await bcrypt.compare(password, matchingUser.password);
            if (passMatches) {
                const seshkey = crypto.randomBytes(16).toString('hex').substring(0, 16);
                await knex("users")
                    .where({username})
                    .update({
                        seshkey
                    })
                    .catch(e => {
                        throw e;
                    });
                res.send({success: true, data: seshkey});
            }
        } else {
            res.send({success: false, data: null})
        }
    });

    app.post('/loginIntellij', async (req, res) => {
        const username = req.body.username;
        const password = req.body.password;
        const matchingUser = await knex("users")
            .where({username})
            .first()
            .catch(e => {
                throw e;
            });
        if (matchingUser) {
            const passMatches = await bcrypt.compare(password, matchingUser.password);
            if (passMatches) {
                const seshkey = crypto.randomBytes(16).toString('hex').substring(0, 16);
                await knex("users")
                    .where({username})
                    .update({
                        seshkey
                    })
                    .catch(e => {
                        throw e;
                    });
                res.send(seshkey);
            } else {
                res.send("false");
            }
        } else {
            res.send("false")
        }
    });

    app.post('/loginSeshkey', async (req, res) => {
        const seshkey = req.body.seshkey;
        const matchingUser = await knex("users")
            .where({seshkey})
            .first()
            .catch(e => {
                throw e;
            });
        if (matchingUser) {
            res.send({status: true});
        } else {
            res.send({status: false});
        }
    });

    app.post('/loginSeshkeyIntellij', async (req, res) => {
        const seshkey = req.body.seshkey;
        const matchingUser = await knex("users")
            .where({seshkey})
            .first()
            .catch(e => {
                throw e;
            });
        if (matchingUser) {
            res.send("true");
        } else {
            res.send("false");
        }
    });

    app.post('/logout', async (req) => {
        const username = req.body.username;
        await knex("users")
            .where({username})
            .update({
                seshkey: null
            })
            .catch(e => {
                throw e;
            })
    });

    app.post('/createUser', async (req, res) => {
        const username = req.body.username;
        const [password, userExists] = await Promise.all([
            bcrypt.hash(req.body.password, 13),
            doesUserExist(username)
        ]);
        if (!userExists) {
            const seshkey = crypto.randomBytes(16).toString('hex').substring(0, 16);
            console.log(`${username}|${password}|${seshkey}`);
            await knex("users")
                .insert({
                    username,
                    password,
                    seshkey,
                    userid: await getHighestUserId()
                })
                .catch(e => {
                    throw e;
                });
            res.send({success: true, data: seshkey});
        } else {
            res.send({success: false});
        }
    });

    app.get("/", (req, res) => {
        res.send("Welcome to the TimeTrackr server! This probably isn't what you're looking for, as the real site will be up soon. This is just where the API is in case you want to do anything. API docs can be found... somewhere. Not up yet. Glad to see you're interested in the project :)");
    })
};
