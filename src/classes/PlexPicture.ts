import { PlexFileContent } from "./PlexFileContent.js";
import util = require("../util.js");
import { PlexServer } from "./PlexServer.js";

export class PlexPicture extends PlexFileContent {
    height: number;
    width: number;
    constructor(data: any, sectionID: number, server: PlexServer) {
        super(data, sectionID, server);
        this.height = data.Media[0].height;
        this.width = data.Media[0].width;
        util.valueCheck(this);
    }

    getImageURL(x: string, y: string): string {
        let undefCount = 0;
        undefCount += +(x === undefined);
        undefCount += +(y === undefined);
        if (undefCount === 1)
            throw new Error("Either specify none or both values");
        if (undefCount === 2)
            return this.server.makeRequestURL(this.filepath);
        return this.server.makeRequestURL("/photo/:/transcode?width=" + x + "&height=" + y + "&minSize=1&url=" + this.filepath);
    }

    async getImageBuffer(x: string, y: string) {
        let undefCount = 0;
        undefCount += +(x === undefined);
        undefCount += +(y === undefined);
        if (undefCount === 1)
            throw new Error("Either specify none or both values");
        if (undefCount === 2)
            return await this.server.request(this.filepath, "GET", "image/png");
        return await this.server.request("/photo/:/transcode?width=" + x + "&height=" + y + "&minSize=1&url=" + this.filepath, "GET", "image/png");
    }
}