"use strict"
module.exports = (function(){
if(!Array.prototype.findLastIndex) Object.defineProperty(Array.prototype, 'findLastIndex', {
    value(f){
        let i = this.length
        while(i--)
            if(f(this[i], i, this))
                return i
    },
    writable: true, configurable: true
})
return {}
})()