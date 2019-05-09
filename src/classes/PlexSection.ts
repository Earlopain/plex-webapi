import { PlexPicture } from "./PlexPicture.js";
import { PlexArtist } from "./PlexArtist.js";
import util = require("../util.js");
import { PlexServer } from "./PlexServer.js";
import { PlexSong } from "./PlexSong.js";
export class PlexSection {

    title: string;
    id: number;
    type: string;
    files: (PlexArtist | PlexPicture)[];
    server: PlexServer;
    localLocations: string[];

    constructor(json, server: PlexServer) {
        this.title = json.title;
        this.id = json.key;
        this.type = json.type;
        this.files = [];
        this.server = server;
        this.localLocations = json.Location.map(element => {return element.path});
        util.valueCheck(this);
    }

    async getAllContent(): Promise<(PlexArtist | PlexPicture)[]> {
        if (this.files.length !== 0)
            return this.files;
        const json = await this.server.request("/library/sections/" + this.id + "/all", "GET");
        
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

    async getAllFiles(): Promise<(PlexPicture | PlexSong)[]> {
        let result = [];
        let json;
        switch (this.type) {
            case "artist":
                json = await this.server.request("/library/sections/" + this.id + "/all?type=10");
                for (const song of json.MediaContainer.Metadata) {
                    result.push(new PlexSong(song, this.id, this.server));
                }
                break;
            case "photo":
                json = await this.server.request("/library/sections/" + this.id + "/all?type=12,13");
                for (const picture of json.MediaContainer.Metadata) {
                    result.push(new PlexPicture(picture, this.id, this.server));
                }
                break;

            default:
                debugger;
                break;
        }
        return result;
    }
}