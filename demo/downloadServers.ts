import fs = require("fs");
import path = require("path");
import { PlexUser } from "../src/classes/PlexUser.js";
import { PlexSection } from "../src/classes/PlexSection.js";

const plexToken = JSON.parse(fs.readFileSync(__dirname + "/secrets.json", "utf8")).plexToken;

async function main() {
    let user = await PlexUser.init({ token: plexToken });
    const servers = await user.getAvailableServers();
    for (const server of servers) {
        const sections = await server.getAllSections();
        for (const section of sections) {
            await saveSectionToDisk(section);
        }
    }
}

async function saveSectionToDisk(section: PlexSection) {
    const serverName = await section.server.getName();
    const sectionName = section.title;
    const rootPath = serverName + "/" + sectionName;
    if (!fs.existsSync(rootPath))
        fs.mkdirSync(rootPath, { recursive: true });
    const files = await section.getAllFiles();
    for (const file of files) {
        let pathExtra;
        for (const localLocation of section.localLocations) {
            if (file.localPath.startsWith(localLocation))
                pathExtra = file.localPath.split(localLocation)[1];
        }
        pathExtra = pathExtra.replace(/\\/g, "/");
        if (!fs.existsSync(path.dirname(rootPath + pathExtra)))
            fs.mkdirSync(path.dirname(rootPath + pathExtra), { recursive: true });
        if (!fs.existsSync(rootPath + pathExtra)) {
            const fileBuffer = await file.getFileBuffer();
            fs.writeFileSync(rootPath + pathExtra, fileBuffer, "binary");
        }
    }
}

main();