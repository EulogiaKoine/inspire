"use strict"
module.exports = function(path, r_inspire){
const gamma = r_inspire('gamma').gamma
function Pf(n, r){
    if(r < 0 || r > n) return 0
    return gamma(n+1) / gamma(n-r+1)
}
if(!Math.Pf) Math.Pf = Pf
return { Pf: Pf }
}