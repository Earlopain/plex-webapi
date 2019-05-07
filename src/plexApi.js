const request = require("request");
const fs = require("fs");
const PlexUser = require("./classes/PlexUser.js");

const plexToken = JSON.parse(fs.readFileSync("./secrets.json")).plexToken;

async function main() {
    let user = await new PlexUser({ token: plexToken });
    const servers = await user.getAvailableServers();
    for (const server of servers) {
        const sections = await server.getAllSections();
        debugger;
    }
}

main();