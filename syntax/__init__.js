"use strict"
module.exports = function(path, r_inspire){
return {
    assert: r_inspire('assert').assert,
    inherits: r_inspire('inherits').inherits
}
}