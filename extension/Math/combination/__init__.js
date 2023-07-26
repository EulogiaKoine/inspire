"use strict"
module.exports = function(path, r_inspire){
return {
    C: r_inspire('C').C,
    P: r_inspire('P').P,
    fact: r_inspire('fact').fact,

    gamma: r_inspire('gamma').gamma,
    Cf: r_inspire('Cf').Cf,
    Pf: r_inspire('Pf').Pf,
    factf: r_inspire('factf').factf
}
}