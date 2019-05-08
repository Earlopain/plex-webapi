import * as crypto from "crypto";
import * as request from "request";

import { PlexServer } from "./PlexServer.js";
import util = require("../util.js");

export class PlexUser {
    email: string;
    username: string;
    token: string;
    avatar: string;
    constructor(data: { email: string; username: string; token: string; avatar: string; }) {
        this.email = data.email;
        this.username = data.username;
        this.token = data.token;
        this.avatar = data.avatar;
    }

    static init(data: { email?: string; password?: string; token?: string; }): PromiseLike<PlexUser> {
        if (!(data.email && data.password) && !data.token) {
            throw new Error("Either provide email/password or token");
        }
        return new Promise(async resolve => {
            if (data.email && data.password) {
                const json = await util.postJSON("https://plex.tv/api/v2/users/signin.json" + "?login=" + data.email + "&password=" + data.password, {
                    "X-Plex-Client-Identifier": "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
                        (parseInt(c) ^ crypto.randomBytes(8)[0] & 15 >> parseInt(c) / 4).toString(16))
                })
                resolve(new PlexUser({ email: data.email, username: json.title, token: json.authToken, avatar: json.thumb }));
            }
            else {
                let account = await PlexUser.getAccountDetails(data.token);
                account = account.user;
                resolve(new PlexUser({ email: account.email, username: account.title, token: data.token, avatar: account.thumb }));
            }
        })
    }

    private static async getAccountDetails(token: string) {
        const str = await PlexUser.request("/users/account.json", token);
        return JSON.parse(str);
    }

    async getAccountDetails() {
        const str = await this.request("/users/account.json");
        return JSON.parse(str);
    }

    async getAvailableServers(): Promise<PlexServer[]> {
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

    makeRequestURL(url: string) {
        if (!url.includes("?"))
            return "https://plex.tv" + url + "?X-Plex-Token=" + this.token;
        else
            return "https://plex.tv" + url + "&X-Plex-Token=" + this.token;
    }

    private static makeRequestURL(url: string, token: string) {
        if (!url.includes("?"))
            return "https://plex.tv" + url + "?X-Plex-Token=" + token;
        else
            return "https://plex.tv" + url + "&X-Plex-Token=" + token;
    }

    request(url: string): PromiseLike<string> {
        url = this.makeRequestURL(url);
        return new Promise(resolve => {
            request({
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

    private static request(url: string, token: string): PromiseLike<string> {
        url = PlexUser.makeRequestURL(url, token);
        return new Promise(resolve => {
            request({
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