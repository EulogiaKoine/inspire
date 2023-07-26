"use strict"
module.exports = (function(){
function P(n, r){
    if(typeof n === 'number' && typeof r === 'number'){
        let res = 1
        while(r--)
            res *= n--
        return res
    }
    throw new TypeError("Math.P - 1st, 2nd argument must be integers")
}
if(!Math.P) Math.P = P
return { P: P }
})()