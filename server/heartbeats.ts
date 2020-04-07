import { newHeartbeat } from "./helpers/heartbeats";

module.exports = (app) => {
    app.post('/heartbeat', async (req) => {
        const seshkey = req.body.seshkey;
        const editor = req.body.editor;
        const project = req.body.project;
        const file = req.body.file;
        const language = req.body.language;
        newHeartbeat(seshkey, editor, project, file, language);
    });
};
