import { PlexFileContent } from "./PlexFileContent.js";
import { valueCheck } from "./../util.js";
import { PlexServer } from "./PlexServer.js";

export class PlexSong extends PlexFileContent {
    sectionID: number;
    duration: number;
    filepath: string;
    filesize: number;
    constructor(data: any, sectionID: number, server: PlexServer) {
        super(data, sectionID, server)
        this.duration = data.duration;

        valueCheck(this);
    }
}