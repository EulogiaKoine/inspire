"use strict"
module.exports = function(path, r_inspire, _global){

function inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {value: subClass, writable: true, configurable: true}});
    Object.defineProperty(subClass, "prototype", {writable: false});
    if (superClass) {
        Object.setPrototypeOf(subClass, superClass);
    }
}

if(!_global.inherits) _global.inherits = inherits

return {
    inherits: inherits
}
}