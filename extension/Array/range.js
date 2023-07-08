"use strict"
module.exports = (function(){
function range(s, e, t){
    t = +t || 1
    if(e === void 0) {
        e = s
        s = 0
    }
    const r = []
    while(t>0? s<e: s>e) {
        r.push(s)
        s += t
    }
    return r
}
if(!Array.range) Array.range = range
return { range: range }
})()