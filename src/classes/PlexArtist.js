const PlexGenericFile = require("./PlexGenericFile.js");
const util = require("../util.js");

class PlexArtist extends PlexGenericFile {
    constructor(data, sectionID, server) {
        super(data, sectionID, server);
        this.genres = [];
        if (!data.Genre)
            this.genres = [];
        else {
            for (const genre of data.Genre) {
                this.genres.push(genre.tag);
            }
        }

        return new Promise(async resolve => {
            const data = await this.server.request("/library/metadata/" + this.key + "/children");
            this.albums = await PlexAlbum.getAlbumsFromArtistData(data.MediaContainer, this.sectionID, this.server);
            util.valueCheck(this);

            resolve(this);
        })
    }
}

module.exports = PlexArtist;