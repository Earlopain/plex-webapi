import { PlexPicture } from "./PlexPicture.js";
import { PlexArtist } from "./PlexArtist.js";
import util = require("../util.js");
import { PlexServer } from "./PlexServer.js";
export class PlexSection {

    title: string;
    id: number;
    size: number;
    type: string;
    files: (PlexArtist | PlexPicture)[];
    server: PlexServer

    constructor(json, server: PlexServer) {
        this.title = json.MediaContainer.librarySectionTitle;
        this.id = json.MediaContainer.librarySectionID;
        this.size = json.MediaContainer.size;
        this.type = json.MediaContainer.viewGroup;
        this.files = [];
        this.server = server;
        util.valueCheck(this);
    }

    async getContent(): Promise<(PlexArtist | PlexPicture)[]> {
        if (this.files.length !== 0)
            return this.files;
        const json = await this.server.request("/library/sections/" + this.id + "/all", "GET");

        if (this.files.length !== 0)
            return this.files;
        switch (this.type) {
            case "photo":
                for (const file of json.MediaContainer.Metadata) {
                    this.files.push(new PlexPicture(file, this.id, this.server));
                }
                break;
            case "artist":
                for (const file of json.MediaContainer.Metadata) {
                    this.files.push(await new PlexArtist(file, this.id, this.server));
                }
                break;
            default:
                break;
        }
        return this.files;
    }
}