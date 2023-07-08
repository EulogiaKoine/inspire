"use strict"
module.exports = (function(){

function values(o){
    if(o){
        const v = Object.keys(o)
        for(let i = 0; i < v.length; i++)
            v[i] = o[v[i]]
        return v
    } else {
        const e = new Error("Cannot convert undefined or null to object")
        e.name = "Uncaught TypeError"
        throw e
    }
}

if(!Object.values) Object.values = values

return { values: values }
})()