const request = require("request");
const fs = require("fs");
const PlexServer = require("./classes/PlexServer.js");

const server = "http://192.168.178.97:32400";
const plexToken = "fpJx4zeYwyou3KWv4BNX";
const sectionName = "e621";

const onlineTagCutoff = 30;     //If the tag has less than this many entries, don't send it to the server
const localTagCutoff = 5;       //How often does it have to appear locally
const tagWhitelist = [];        //Those will not be filtered regardless of the above,
//works like on e6, probably
const lastRun = 1557097673;
console.log(Math.floor(new Date().getTime() / 1000));
console.log("Write this into lastRun so only newly added files get parsed");
async function main() {
    let plexServer = new PlexServer(server, plexToken);
    const sectionID = await plexServer.sectionNameToKey(sectionName);
    const sectionContent = await plexServer.getAllFromSectionID(sectionID);
}

main();