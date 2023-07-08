"use strict"
module.exports = (function(){
if(!Array.prototype.toReversed) Object.defineProperty(Array.prototype, 'toReversed', {
    value(){
        return this.slice().reverse()
    },
    writable: true, configurable: true
})
return {}
})()