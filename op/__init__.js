"use strict"
module.exports = function(path, r_inspire){
    r_inspire('DecodeFuncString')
    return {
        power: r_inspire('power'),
        evaluate: r_inspire('evaluate')
    }
}