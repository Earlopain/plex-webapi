import * as request from "request";

import { parseString as xmlParserFunction } from "xml2js";

export function valueCheck(that: any) {
    for (const key of Object.keys(that)) {
        if (key === "thumbpath" && that[key] === undefined)
            that[key] = "/";        //TODO find blank image
        if (that[key] === undefined)
            debugger;
    }
}

export function getJSON(url: string, headers: any): PromiseLike<any> {
    return new Promise(resolve => {
        request({
            method: "GET", uri: encodeURI(url), headers: headers     //enocdeURI takes care of chars like é which
        }, (error, response, body: string) => {
            if (error)
                debugger;
            resolve(JSON.parse(body));
        });
    });
}

export function postJSON(url: string, headers2: any): PromiseLike<any> {
    return new Promise(resolve => {
        request({
            method: "POST", uri: encodeURI(url), headers: headers2     //enocdeURI takes care of chars like é which
        }, (error: any, response: any, body: string) => {
            if (error)
                debugger;
            resolve(JSON.parse(body));
        });
    });
}

export function xmlParser(xmlstring: string): PromiseLike<any> {
    return new Promise(resolve => {
        xmlParserFunction(xmlstring, function (err, result) {
            resolve(result);
        });
    })
}