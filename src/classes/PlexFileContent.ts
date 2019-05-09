import { PlexServer } from "./PlexServer";

import { PlexGenericFile } from "./PlexGenericFile.js";


export class PlexFileContent extends PlexGenericFile {
    filepath: string;
    size: number;
    extension: string;
    localPath: string;

    constructor(data: any, sectionID: number, server: PlexServer) {
        super(data, sectionID, server);
        this.filepath = data.Media[0].Part[0].key;
        this.size = data.Media[0].Part[0].size;
        this.extension = data.Media[0].container;
        this.localPath = data.Media[0].Part[0].file
    }

    getFileURL() {
        return this.server.makeRequestURL(this.filepath);
    }

    async getFileBuffer() {
        const url = this.getFileURL();
        return await this.server.request(url, "GET", "*/*");
    }
}