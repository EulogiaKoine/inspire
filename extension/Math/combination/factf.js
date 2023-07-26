"use strict"
module.exports = function(path, r_inspire){
const gamma = r_inspire('gamma').gamma
function factf(n){
    return gamma(n+1)
}
if(!Math.factf) Math.factf = factf
return { factf: factf }
}