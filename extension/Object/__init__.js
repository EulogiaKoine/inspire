"use strict"
module.exports = function(path, r_inspire){
return {
    values: r_inspire('values').values,
    entries: r_inspire('entries').entries,
    deepCopy: r_inspire('deepCopy').deepCopy
}
}