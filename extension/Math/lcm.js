"use strict"
module.exports = function(path, r_inspire){
const gcd = r_inspire('gcd').gcd
function lcm(){
    if(arguments.length < 2)
        return arguments[0]

    let v = arguments[0]
    for(let i of Array.prototype.splice.call(arguments, 1))
        v = v*i/gcd(v,i)
    return v
}
if(!Math.lcm) Math.lcm = lcm
return { lcm: lcm }
}