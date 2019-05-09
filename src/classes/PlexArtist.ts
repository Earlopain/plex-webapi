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
        this.albums = [];
        if (!data.Genre)
            this.genres = [];
        else {
            for (const genre of data.Genre) {
                this.genres.push(genre.tag);
            }
        }


    }

    async getAlbums(): Promise<PlexAlbum[]> {
        return new Promise(async resolve => {
            if (this.albums.length !== 0)
                resolve(this.albums);
            const allAlbums = await this.server.request("/library/metadata/" + this.key + "/children");
            for (const album of allAlbums.MediaContainer.Metadata) {
                this.albums.push(await new PlexAlbum(album, this.sectionID, this.server))
            }
            util.valueCheck(this);

            resolve(this.albums);
        })
    }

    async getContent(): Promise<PlexAlbum[]> {
        return new Promise(async resolve => {
            await this.getAlbums();
            for (const album of this.albums) {
                await album.getContent();
            }
            util.valueCheck(this);

            resolve(this.albums);
        })
    }
}