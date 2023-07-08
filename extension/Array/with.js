"use strict"
module.exports = (function(){
if(!Array.prototype.with) Object.defineProperty(Array.prototype, 'with', {
    value(i, v){
        if((i>>= 0) < 0 || i >= this.length){
            let e = new RangeError("Invalid index: "+i)
            Error.captureStackTrace(e)
            throw e
        }
        return Array.from(this).splice(i, 1, v)
    },
    writable: true, configurable: true
})
return {}
})()