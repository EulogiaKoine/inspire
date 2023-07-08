"use strict"
module.exports = (function(){
if(!String.prototype.countSplitLeft) Object.defineProperty(String.prototype, 'countSplitLeft', {
    value(n){
        if((n >>= 0) < 1) throw new RangeError("Invalid Count: "+n)
        const len = Math.ceil(this.length / n)
        const r = []
        for(let i = 0; i < len;) {
            r[i] = this.slice(i * n, (++i) * n)
        }
        return r
    },
    writable: true, configurable: true
})
return {}
})