"use strict"
module.exports = (function(){
if(!String.prototype.countSplitRight) Object.defineProperty(String.prototype, 'countSplitRight', {
    value(n){
        if((n >>= 0) < 1) throw new RangeError("Invalid Count: "+n)
        const r = []
        let i = this.length, j = Math.ceil(i/n)-1
        while(i > 0){
            r[j--] = this.slice(Math.max(0, i-n), i)
            i -= n
        }
        return r
    },
    writable: true, configurable: true
})
return {}
})