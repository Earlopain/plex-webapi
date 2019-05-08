import util = require("../util.js");
import { PlexServer } from "./PlexServer.js";

export class PlexGenericFile {
    addedAt: number;
    updatedAt: number;
    key: number;
    title: string;
    sectionID: number;
    thumbpath: string;
    server: PlexServer;
    constructor(data, sectionID: number, server: PlexServer) {
        if (!sectionID || !server)
            throw new Error("Forgot to put section id/server");
        this.addedAt = data.addedAt === undefined ? -1 : data.addedAt;
        this.updatedAt = data.updatedAt === undefined ? -1 : data.updatedAt;
        this.key = data.ratingKey === undefined ? data.key : data.ratingKey;
        this.title = data.title ? data.title : data.title2;
        this.sectionID = sectionID;
        this.thumbpath = data.thumb;
        this.server = server;
        util.valueCheck(this);
    }

    getThumbnailURL(x?: number, y?: number): string {
        let undefCount = 0;
        undefCount += +(x === undefined);
        undefCount += +(y === undefined);
        if (undefCount === 1)
            throw new Error("Either specify none or both values");
        if (undefCount === 2)
            return this.server.makeRequestURL(this.thumbpath);
        return this.server.makeRequestURL("/photo/:/transcode?width=" + x + "&height=" + y + "&minSize=1&url=" + this.thumbpath);
    }

    async getThumbnailBuffer(x?: number, y?: number) {
        let undefCount = 0;
        undefCount += +(x === undefined);
        undefCount += +(y === undefined);
        if (undefCount === 1)
            throw new Error("Either specify none or both values");
        if (undefCount === 2)
            return await this.server.request(this.thumbpath, "GET", "image/png");
        return await this.server.request("/photo/:/transcode?width=" + x + "&height=" + y + "&minSize=1&url=" + this.thumbpath, "GET", "image/png");
    }

    async addTags(tagarray) {
        let tagString = "";
        tagarray.forEach((tag, index) => {
            tagString += "tag[" + index + "].tag.tag=" + tag.replace(/_/g, " ") + "&";
        });
        tagString = tagString.slice(0, -1);
        await this.server.request("/library/sections/" + this.sectionID + "/all?type=13&id=" + this.key + "&" + tagString, "PUT");
    }

    async setTags(tagarray) {
        await this.removeAllTags();
        let tagString = "";
        tagarray.forEach((tag, index) => {
            tagString += "tag[" + index + "].tag.tag=" + tag.replace(/_/g, " ") + "&";
        });
        tagString = tagString.slice(0, -1);
        await this.server.request("/library/sections/" + this.sectionID + "/all?type=13&id=" + this.key + "&" + tagString, "PUT");
    }

    async  removeTags(tagarray) {
        let tagString = "tag[].tag.tag-=";
        tagarray.forEach((tag, index) => {
            tagString += tag.replace(/_/g, " ") + ",";
        });
        await this.server.request("/library/sections/" + this.sectionID + "/all?type=12,13&id=" + this.key + "&" + tagString, "PUT");
    }

    async getAllTags(): Promise<string[]> {
        const json = await this.getMetadata();
        if (!json.MediaContainer.Metadata[0].Tag)
            return [];
        return json.MediaContainer.Metadata[0].Tag.map(element => { return element.tag })
    }
    async removeAllTags() {
        const removeThis = await this.getAllTags();
        await this.removeTags(removeThis)
    }

    async getMetadata() {
        return await this.server.request("/library/metadata/" + this.key, "GET");
    }
}