"use strict"
module.exports = (function(){
if(!Array.prototype.random) Object.defineProperty(Array.prototype, 'random', {
    value(s, e){
        s = s>>0 || 0
        e = e>>0 || this.length
        return this[Math.floor(Math.random()*(e-s)+s)]
    },
    writable: true, configurable: true
})
return {}
})()