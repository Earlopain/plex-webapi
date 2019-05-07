const request = require("request");
const fs = require("fs");
const crypto = require('crypto');
const xmlParserFunction = require('xml2js').parseString;

function valueCheck(that) {
    for (const key of Object.keys(that)) {
        if (key === "thumbpath" && that[key] === undefined)
            that[key] = "/";        //TODO find blank image
        if (that[key] === undefined)
            debugger;
    }
}

function getJSON(url, headers) {
    return new Promise(resolve => {
        request({
            method: "GET", uri: encodeURI(url), headers: headers     //enocdeURI takes care of chars like é which
        }, (error, response, body) => {
            if (error)
                debugger;
            resolve(JSON.parse(body));
        });
    });
}

function postJSON(url, headers2, data) {
    return new Promise(resolve => {
        request({
            method: "POST", uri: encodeURI(url), headers: headers2, formData: data     //enocdeURI takes care of chars like é which
        }, (error, response, body) => {
            if (error)
                debugger;
            resolve(JSON.parse(body));
        });
    });
}

function xmlParser(xmlstring) {
    return new Promise(resolve => {
        xmlParserFunction(xmlstring, function (err, result) {
            resolve(result);
        });
    })
}

exports.valueCheck = valueCheck;
exports.getJSON = getJSON;
exports.postJSON = postJSON;
exports.xmlParser = xmlParser;