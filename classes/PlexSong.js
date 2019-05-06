const PlexFileContent = require("./PlexFileContent.js");
const util = require("./../util.js");

class PlexSong extends PlexFileContent {
    constructor(data, sectionID, server) {
        super(data, sectionID, server);
        this.duration = data.duration;
        this.filepath = data.Media[0].Part[0].key;
        this.filesize = data.Media[0].Part[0].size;
        
        util.valueCheck(this);
    }
}

module.exports = PlexSong;