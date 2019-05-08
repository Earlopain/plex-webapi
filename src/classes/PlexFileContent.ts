import { PlexServer } from "./PlexServer";

import { PlexGenericFile } from "./PlexGenericFile.js";


export class PlexFileContent extends PlexGenericFile {
    filepath: string;
    filesize: number;
    constructor(data: any, sectionID: number, server: PlexServer) {
        super(data, sectionID, server);
        this.filepath = data.Media[0].Part[0].key;
        this.filesize = data.Media[0].Part[0].size;
    }
}