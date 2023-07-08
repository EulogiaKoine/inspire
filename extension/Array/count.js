"use strict"
module.exports = (function(){
if(!Array.prototype.count) Object.defineProperty(Array.prototype, 'count', {
    value(v){
        let n = 0
        for(let i of this)
            if(i === v) n++
        return n
    },
    writable: true,
    configurable: true
})
return {}
})()