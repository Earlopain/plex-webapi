const crypto = require("crypto");
const requestReq = require("request");

const PlexServer = require("./PlexServer.js");
const util = require("../util.js");

class PlexUser {
    constructor(data) {
        return new Promise(async resolve => {
            if (data.email && data.password) {
                const json = await util.postJSON("https://plex.tv/api/v2/users/signin.json" + "?login=" + data.email + "&password=" + data.password, {
                    "X-Plex-Client-Identifier": ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => //https://stackoverflow.com/a/2117523
                        (c ^ crypto.randomBytes(8)[0] & 15 >> c / 4).toString(16)
                    )
                })
                this.token = json.authToken;
                this.email = data.email;
                this.avatar = json.thumb;
                this.username = json.title;
                resolve(this);

            }
            else if (data.token) {
                this.token = data.token;
                let account = await this.getAccountDetails();
                account = account.user;
                this.email = account.email;
                this.avatar = account.thumb;
                this.username = account.title;
                resolve(this);
            }
            else
                throw new Error("Either provide email+passwd or token");
        })
    }

    async getAccountDetails() {
        const str = await this.request("/users/account.json");
        return JSON.parse(str);
    }

    async getAvailableServers() {
        let result = [];
        const str = await this.request("/pms/resources.xml?includeHttps=1");
        const xml = await util.xmlParser(str);
        const servers = xml.MediaContainer.Device.filter(element => {
            element = element["$"];
            return element.provides === "server";
        }).map(element => {
            if (element["$"].publicAddressMatches === "1")
                element["$"].Connection = element.Connection[0]["$"];
            else
                element["$"].Connection = element.Connection[1]["$"];
            return element["$"];
        });
        for (const server of servers) {
            result.push(await new PlexServer(server.Connection.uri, server.accessToken));
        }
        return result;
    }

    makeRequestURL(url) {
        if (!url.includes("?"))
            return "https://plex.tv" + url + "?X-Plex-Token=" + this.token;
        else
            return "https://plex.tv" + url + "&X-Plex-Token=" + this.token;
    }

    request(url) {
        url = this.makeRequestURL(url);
        return new Promise(resolve => {
            requestReq({
                method: "GET", uri: encodeURI(url), headers: {     //enocdeURI takes care of chars like é which
                    "Accept": "application/json"                   //would otherwise result in malfored requests
                }
            }, (error, response, body) => {
                if (error)
                    debugger;
                if (response.statusCode === 422)
                    throw new Error("Check Plex Token");
                resolve(body);
            });
        });
    }
}

module.exports = PlexUser;