"use strict"
module.exports = function(path, r_inspire){
return Object.assign({
        clamp: r_inspire('clamp').clamp,
        gcd: r_inspire('gcd').gcd,
        lcm: r_inspire('lcm').lcm,
        lerp: r_inspire('lerp').lerp,
        randint: r_inspire('randint').randint,
    },
    r_inspire('combination')
)
}