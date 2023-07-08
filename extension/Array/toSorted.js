"use strict"
module.exports = (function(){
if(!Array.prototype.toSorted) Object.defineProperty(Array.prototype, 'toSorted', {
    value(f){
        return this.slice().sort(f)
    },
    writable: true, configurable: true
})
return {}
})()