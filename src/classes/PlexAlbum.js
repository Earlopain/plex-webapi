const PlexGenericFile = require("./PlexGenericFile.js");
const util = require("./../util.js");

class PlexAlbum extends PlexGenericFile {
    constructor(data, sectionID, server) {
        super(data, sectionID, server);
        this.songs = [];
        return new Promise(async resolve => {
            this.artist = data.parentTitle;
            const json = await server.request("/library/metadata/" + this.key + "/children");
            for (const song of json.MediaContainer.Metadata) {
                this.songs.push(new PlexSong(song, this.sectionID, this.server));
            }
            util.valueCheck(this);
            resolve(this);
        })
    }

    static async getAlbumsFromArtistData(data, sectionID, server) {
        let result = [];
        const allAlbums = await server.request("/library/metadata/" + data.key + "/children");
        for (const album of allAlbums.MediaContainer.Metadata) {
            result.push(await new PlexAlbum(album, sectionID, server))
        }
        return result;
    }
}

module.exports = PlexAlbum;