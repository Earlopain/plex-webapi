function valueCheck(that) {
    for (const key of Object.keys(that)) {
        if (key === "thumbpath" && that[key] === undefined)
            that[key] = "/";        //TODO find blank image
        if (that[key] === undefined)
            debugger;
    }
}

exports.valueCheck = valueCheck;