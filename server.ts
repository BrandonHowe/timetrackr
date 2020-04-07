import knex from "./knex";
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

import {newHeartbeat} from "./heartbeats";

const express = require('express');
const app = express();
app.use(bodyParser);
const port = 1700;

app.get('/', (req, res) => res.send('Hello World!'));

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
            const seshkey = crypto.randomBytes(16).toString('hex');
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

const doesUserExist = async (username: string): Promise<Boolean> => {
    const userList = await knex("users")
        .where({username})
        .first()
        .catch(e => {
            throw e;
        });
    return !!userList;
};

app.post('/createUser', async (req, res) => {
    const username = req.body.username;
    const [password, userExists] = await Promise.all([
        bcrypt.hash(req.body.password, 13),
        doesUserExist(username)
    ]);
    if (userExists) {
        const seshkey = crypto.randomBytes(16).toString('hex');
        await knex("users")
            .insert({
                username,
                password,
                seshkey
            })
            .catch(e => {
                throw e;
            });
        res.send({success: true, data: seshkey});
    } else {
        res.send({success: false});
    }
});

app.post('/heartbeat', async (req) => {
    const seshkey = req.body.seshkey;
    const editor = req.body.editor;
    const project = req.body.project;
    const file = req.body.file;
    const language = req.body.language;
    newHeartbeat(seshkey, editor, project, file, language);
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
