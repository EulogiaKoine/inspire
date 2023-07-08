"use strict"
module.exports = (function(){
if(!Array.prototype.at) Object.defineProperty(Array.prototype, 'at', {
    value(i){
        return this[i<0?this.length+i:i]
    },
    writable: true,
    configurable: true
})
return {}
})()