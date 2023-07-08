"use strict"
module.exports = (function(){
/**
 * @name Object.deepCopy
 * @author 와!
 */
function deepCopy(o) {
    if(Array.isArray(o)) {
        const r = []
        for(let i = 0; i < o.length; i++) {
            r.push(deepCopy(o[i]))
        }
        return r
    }
    if(typeof o === "object") {
        o = Object.assign({}, o)
        for(let a of Object.getOwnPropertyNames(o))
            o[a] = deepCopy(o[a])
    }
    return o
}

if(!Object.deepCopy) Object.deepCopy = deepCopy

return { deepCopy: deepCopy }
})()