"use strict"
module.exports = (function(){
if(!Array.prototype.findLast) Object.defineProperty(Array.prototype, 'findLast', {
    value(f){
        let i = this.length
        while(i--)
            if(f(this[i], i, this))
                return this[i]
    },
    writable: true, configurable: true
})
return {}
})