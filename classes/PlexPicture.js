const PlexFileContent = require("./PlexFileContent.js");
const util = require("./../util.js");

class PlexPicture extends PlexFileContent {
    constructor(data, sectionID, server) {
        super(data, sectionID, server);
        this.height = data.Media[0].height;
        this.width = data.Media[0].width;
        util.valueCheck(this);
    }

    async getImage(x, y) {
        let undefCount = 0;
        undefCount += x === undefined;
        undefCount += y === undefined;
        if (undefCount === 1)
            throw new Error("Either specify none or both values");
        if (undefCount === 2)
            return await this.server.request(this.filepath, "GET");
        return await this.server.request("/photo/: /transcode?width=" + x + "&height=" + y + "&minSize=1&url=" + this.filepath, "GET");
    }
}

module.exports = PlexPicture;