"use strict"
module.exports = (function(){
if(!Array.prototype.shake) Object.defineProperty(Array.prototype, 'shake', {
    value(s, e){
        s >>= 0
        e = e >> 0 || this.length
        let r, t
        const l = e-s
        for(let i = s; i < e; i++){
            r = Math.random()*l+s >> 0
            t = this[r]
            this[r] = this[i]
            this[i] = t
        }
        return this
    },
    writable: true, configurable: true
})
return {}
})