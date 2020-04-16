import { heartbeat } from "./helpers/heartbeats";
import { getIdBySeshkey } from "./helpers/helpers";

module.exports = (app) => {
    app.post('/heartbeat', async (req, res) => {
        const seshkey = req.body.seshkey;
        const editor = req.body.editor;
        const project = req.body.project;
        const language = req.body.language;
        res.send(await heartbeat(await getIdBySeshkey(seshkey), editor, project, language));
    });
};
