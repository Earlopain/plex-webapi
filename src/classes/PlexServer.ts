import request = require("request");

import { PlexSection } from "./PlexSection.js";
import { PlexArtist } from "./PlexArtist.js";
import { PlexPicture } from "./PlexPicture.js";

export class PlexServer {
    hostname: string;
    token: string;
    constructor(hostname: string, token: string) {
        this.hostname = hostname;
        this.token = token;
    }

    makeRequestURL(url: string): string {
        if (!url.startsWith("/")) {
            console.log("Url not starting with /, added it");
            url = "/" + url;
        }
        if (!url.includes("?"))
            return this.hostname + url + "?X-Plex-Token=" + this.token;
        else
            return this.hostname + url + "&X-Plex-Token=" + this.token;
    }

    request(url: string, method?: string, mime?: string): PromiseLike<string | any> {
        if (!method)
            method = "GET";
        if (!mime)
            mime = "application/json";
        const binaryWhitelist = ["application/json"];
        const returnBinary = !binaryWhitelist.includes(mime);
        method = method.toUpperCase();
        url = this.makeRequestURL(url);
        return new Promise(resolve => {
            request({
                method: method, uri: encodeURI(url), headers: {     //enocdeURI takes care of chars like é which
                    "Accept": mime                   //would otherwise result in malfored requests
                }, encoding: returnBinary ? null : undefined
            }, (error, response, body: string) => {
                if (error)
                    debugger;
                if (response.statusCode === 401)
                    throw new Error("Check Plex Token");
                if (method === "PUT" && body !== "")
                    debugger;
                try {
                    resolve(JSON.parse(body));
                }
                catch (e) {
                    resolve(body);
                }
            });
        });
    }

    async getAllSections() {
        const json = await this.request("/library/sections");
        return json.MediaContainer.Directory;
    }

    async sectionNameToKey(string: string) {
        const json = await this.request("/library/sections");
        for (const dir of json.MediaContainer.Directory) {
            if (dir.title === string)
                return dir.key;
        }
        throw new Error("Section not found");
    }

    async getAllFromSectionID(sectionID: number): Promise<(PlexArtist | PlexPicture)[]>  {
        const json = await this.request("/library/sections/" + sectionID + "/all?X-Plex-Container-Start=0&X-Plex-Container-Size=0", "GET");
        const section = new PlexSection(json, this);
        return await section.getContent();
    }
}