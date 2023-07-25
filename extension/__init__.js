"use strict"
module.exports = function(path, r_inspire){
return {
    Array: r_inspire('Array'),
    Date: r_inspire('Date'),
    Math: r_inspire('Math'),
    Object: r_inspire('Object'),
    String: r_inspire('String'),
    FileStream: r_inspire('FileStream')
}
}