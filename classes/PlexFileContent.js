const PlexGenericFile = require("./PlexGenericFile.js");

class PlexFileContent extends PlexGenericFile{
    constructor(data, sectionID, server) {
        super(data,sectionID, server);
        this.filepath = data.Media[0].Part[0].key;
        this.filesize = data.Media[0].Part[0].size;
    }
}

module.exports = PlexFileContent;