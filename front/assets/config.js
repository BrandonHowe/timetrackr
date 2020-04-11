const localUrl = "http://localhost:5000/";
const serverUrl = "http://timetrackr-server.herokuapp.com/";

// const current = "local";
const current = "server";

const currentUrl = current === "local" ? localUrl : serverUrl;

export { currentUrl }
