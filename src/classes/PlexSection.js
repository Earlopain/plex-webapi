const PlexPicture = require("./PlexPicture.js");
const PlexArtist = require("./PlexArtist.js");
const util = require("../util.js");

class PlexSection {
    constructor(json, server) {
        if (!server)
            throw new Error("Forgot to put server");
        return new Promise(async resolve => {
            this.title = json.MediaContainer.librarySectionTitle;
            this.id = json.MediaContainer.librarySectionID;
            this.size = json.MediaContainer.size;
            this.type = json.MediaContainer.viewGroup;
            this.files = [];
            this.server = server;
            switch (this.type) {
                case "photo":
                    for (const file of json.MediaContainer.Metadata) {
                        this.files.push(new PlexPicture(file, this.id, server));
                    }
                    break;
                case "artist":
                    for (const file of json.MediaContainer.Metadata) {
                        this.files.push(await new PlexArtist(file, this.id, server));
                    }
                    break;
                default:
                    break;
            }
            util.valueCheck(this);
            resolve(this);
        })

    }
}

module.exports = PlexSection;