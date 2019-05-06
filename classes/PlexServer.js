const request = require("request");

const PlexSection = require("./PlexSection.js");

class PlexServer {
    constructor(server, token) {
        this.server = server;
        this.token = token;
    }

    request(url, method) {
        if (!method)
            method = "GET";
        method = method.toUpperCase();
        if (!url.includes("?"))
            url = this.server + url + "?X-Plex-Token=" + this.token;
        else
            url = this.server + url + "&X-Plex-Token=" + this.token;
        return new Promise(resolve => {
            request({
                method: method, uri: encodeURI(url), headers: {     //enocdeURI takes care of chars like é which
                    "Accept": "application/json"                   //would otherwise result in malfored requests
                }
            }, (error, response, body) => {
                if (response.statusCode === 401)
                    throw new Error("Check Plex Token");
                if (method === "PUT" && body !== "")
                    debugger;
                try {
                    resolve(JSON.parse(body));
                }
                catch (e) {
                    debugger;
                }

            });
        });
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