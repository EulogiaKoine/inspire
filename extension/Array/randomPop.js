"use strict"
module.exports = (function(){
if(!Array.prototype.randomPop) Object.defineProperty(Array.prototype, 'randomPop', {
    value(s, e){
        s = s>>0 || 0
        e = e>>0 || this.length
        return this.splice(Math.floor(Math.random()*(e-s)+s), 1)[0]
    },
    writable: true, configurable: true
})
return {}
})()