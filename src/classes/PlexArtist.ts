import { PlexGenericFile } from "./PlexGenericFile.js";
import util = require("../util.js");
import { PlexServer } from "./PlexServer.js";
import { PlexAlbum } from "./PlexAlbum.js";

export class PlexArtist extends PlexGenericFile {
    genres: string[];
    albums: PlexAlbum[];
    constructor(data, sectionID: number, server: PlexServer) {
        super(data, sectionID, server);
        this.genres = [];
        if (!data.Genre)
            this.genres = [];
        else {
            for (const genre of data.Genre) {
                this.genres.push(genre.tag);
            }
        }


    }

    async getContent() {//TODO
        return new Promise(async resolve => {
            const data = await this.server.request("/library/metadata/" + this.key + "/children");
            this.albums = await PlexAlbum.getAlbumsFromArtistData(data.MediaContainer, this.sectionID, this.server);
            util.valueCheck(this);

            resolve(this);
        })
    }
}