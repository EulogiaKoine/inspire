"use strict"
module.exports = (function(){

function entries(o){
    if(o){
        const t = Object.keys(o)
        for(let i = 0; i < t.length; i++)
            t[i] = [t[i], o[t[i]]]
        return t
    } else {
        const e = new Error("Cannot convert undefined or null to object")
        e.name = "Uncaught TypeError"
        throw e
    }
}

if(!Object.entries) Object.entries = entries

return { entries: entries }
})()