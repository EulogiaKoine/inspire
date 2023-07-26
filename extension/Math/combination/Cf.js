"use strict"
module.exports = function(path, r_inspire){
const gamme = r_inspire('gamma').gamma
function Cf(n, r){
    if(r < 0 || r > n) return 0
    return gamma(n+1) / gamma(r+1) / gamma(n-r+1)
}
if(!Math.Cf) Math.Cf = Cf;
return { Cf: Cf }
}