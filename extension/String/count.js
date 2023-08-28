"use strict"
module.exports = (function(){
if(!String.prototype.count) Object.defineProperty(String.prototype, 'count', {
    value(v){
        if(typeof v === "string" && v.length !== 0){
            let n = 0
            const c = v.length, l = this.length-c+1
            for(let i = 0; i < l; i++)
                if(this.slice(i, i+c) === v)
                    n++
            return n
        }
        throw new TypeError("String.prototype.count - " + v + " is not a string! it must has a least one character")
    },
    writable: true,
    configurable: true
})
return {}
})()