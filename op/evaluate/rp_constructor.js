"use strict"
module.exports = function(path){
let count = 5 // DEFAULT
function rp_constructor(r){
    if(!(r && typeof r.reply === 'function'))
        throw new Error('rp_constructor - argument must be a replier object in legacy response function, or a msg object in API2 message listener')
    let i = count
    return m => {
        if(i-- > 0) r.reply(m)
    }
}
Object.defineProperty(rp_constructor, 'count', {
    get(){
        return count
    },
    set(v){
        v >>= 0
        if(v > 0) count = v
        else throw new RangeError('rp_constructor.count - count must be a natural number')
    },
    enumerable: true
})
return {
    rp_constructor: rp_constructor
}
}