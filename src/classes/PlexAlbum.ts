import { PlexGenericFile } from "./PlexGenericFile.js";
import util = require("./../util.js");
import { PlexSong } from "./PlexSong.js";
import { PlexServer } from "./PlexServer.js";
export class PlexAlbum extends PlexGenericFile {

    songs: PlexSong[];
    artist: string;
    constructor(data, sectionID, server: PlexServer) {
        super(data, sectionID, server);
        this.songs = [];
        this.artist = data.parentTitle;
    }

    async getContent(): Promise<PlexSong[]> {
        return new Promise(async resolve => {
            if (this.songs.length !== 0)
                resolve(this.songs);
            const json = await this.server.request("/library/metadata/" + this.key + "/children");
            for (const song of json.MediaContainer.Metadata) {
                this.songs.push(new PlexSong(song, this.sectionID, this.server));
            }
            util.valueCheck(this);
            resolve(this.songs);
        })
    }
}