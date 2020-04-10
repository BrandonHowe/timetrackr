const bodyParser = require("body-parser");

const express = require('express');

const app = express();
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

require("./heartbeats")(app);
require("./login")(app);
require("./data/dataRoutes")(app);

const port = process.env.PORT || 1700;

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

export { app };
