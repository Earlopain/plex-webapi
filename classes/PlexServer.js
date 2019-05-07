const request = require("request");

const PlexSection = require("./PlexSection.js");

class PlexServer {
    constructor(server, token) {
        this.server = server;
        this.token = token;
    }

    makeRequestURL(url){
        if (!url.includes("?"))
            return this.server + url + "?X-Plex-Token=" + this.token;
        else
            return this.server + url + "&X-Plex-Token=" + this.token;
    }

    request(url, method, mime) {
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
            }, (error, response, body) => {
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

    async getAllSections(){
        const json = await this.request("/library/sections")
        return json.MediaContainer.Directory;
    }

    async sectionNameToKey(string) {
        const json = await this.request("/library/sections");
        for (const dir of json.MediaContainer.Directory) {
            if (dir.title === string)
                return dir.key;
        }
        throw new Error("Section not found");
    }

    async getAllFromSectionID(section) {
        let json = await this.request("/library/sections/" + section + "/all", "GET");
        return await new PlexSection(json, this);
    }
}

module.exports = PlexServer;