"use strict"
module.exports = (function(){
const cache = [[1]]
function C(n, r){
    if(typeof n === 'number' && typeof r === 'number'){
        n >>= 0
        r >>= 0
        if(n < 0)
            throw new RangeError("MathC - 1st argument must be a natural number or a 0")
        if(r < 0 || r > n) return 0
        if(r === 0 || r === n) return 1
        if(n in cache) return cache[n][r]
        let stack
        for(let i = cache.length; i <= n; i++){
            stack = []
            stack.push(1)
            for(let j = 1; j < i; j++){
                stack[j] = C(i-1,j-1) + C(i-1,j)
            }
            stack.push(1)
            cache.push(stack)
        }
        return cache[n][r]
    }
    throw new TypeError("Math.C - 1st, 2nd argument must be integers")
}
if(!Math.C) Math.C = C
return { C: C }
})()