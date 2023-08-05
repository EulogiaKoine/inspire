"use strict"
module.exports = (function(){

/** @this {Array} */
function repeatArray(n){
    n >>= 0
    if(n < 0) throw new TypeError("Array.prototype.repeatArray - argument must greater than equals with 0")
    if(n === 0) return []
    const res = [], l = this.length, m = l * n
    for(let i = 0; i < m; i++)
        res[i] = this[i % l]
    return res
}

if(!Array.prototype.repeat) Object.defineProperty(Array.prototype, 'repeat', {
    value: repeatArray, 
    writable: true
})

return {}
})()