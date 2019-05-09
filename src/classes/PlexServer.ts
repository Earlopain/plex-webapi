import request = require("request");

import { PlexSection } from "./PlexSection.js";
import { PlexArtist } from "./PlexArtist.js";
import { PlexPicture } from "./PlexPicture.js";

export class PlexServer {
    hostname: string;
    token: string;
    private _name: string;
    constructor(hostname: string, token: string) {
        this.hostname = hostname;
        this.token = token;
    }

    getName(): Promise<string> {
        return new Promise(async resolve => {
            if (this._name)
                resolve(this._name);
            const json = await this.request("/media/providers");
            this._name = json.MediaContainer.friendlyName;
            resolve(this._name);
        })
    }

    makeRequestURL(url: string): string {
        if (url.includes("X-Plex-Token="))
            return url;
        if (!url.startsWith("/")) {
            console.log("Url not starting with /, added it");
            url = "/" + url;
        }
        if (!url.includes("?"))
            return this.hostname + url + "?X-Plex-Token=" + this.token;
        else
            return this.hostname + url + "&X-Plex-Token=" + this.token;
    }

    request(url: string, method?: string, mime?: string): Promise<string | any> {
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

    async getAllSections(): Promise<PlexSection[]> {
        let result = [];
        const json = await this.request("/library/sections");
        for (const section of json.MediaContainer.Directory) {
            result.push(new PlexSection(section, this));
        }
        return result;
    }

    async sectionNameToKey(string: string) {
        const json = await this.request("/library/sections");
        for (const dir of json.MediaContainer.Directory) {
            if (dir.title === string)
                return dir.key;
        }
        throw new Error("Section not found");
    }

    async getAllFromSectionID(sectionID: number): Promise<(PlexArtist | PlexPicture)[]> {
        const json = await this.request("/library/sections/" + sectionID + "/all?X-Plex-Container-Start=0&X-Plex-Container-Size=0", "GET");
        const section = new PlexSection(json, this);
        return await section.getAllContent();
    }
}