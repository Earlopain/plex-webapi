import request = require("request");
import fs = require("fs");
import { PlexUser } from "./classes/PlexUser.js";

const plexToken = JSON.parse(fs.readFileSync(__dirname + "/secrets.json", "utf8")).plexToken;

async function main() {
    let user = await PlexUser.init({ token: plexToken });
    const servers = await user.getAvailableServers();
    for (const server of servers) {
        const sections = await server.getAllSections();
        debugger;
    }
}

main();