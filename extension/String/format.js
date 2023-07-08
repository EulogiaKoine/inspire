"use strict"
module.exports = function(path, r_inspire, _global){
function format(m){
    let s = this
    if(typeof m === "object"){
        for(let key in m)
            s = s.replace(new RegExp("{"+key+"}", "g"), m[key])
        return s
    }

    let i = 0;
    while(i in arguments)
        s = s.replace(new RegExp("{"+i+"}", "g"), arguments[i++])
    return s
}

if(!String.prototype.format)
    Object.defineProperty(String.prototype, 'format', {
        value: format,
        writable: true,
        configurable: true
    })

return {}
}