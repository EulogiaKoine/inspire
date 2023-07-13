"use strict"
module.exports = (function(){
const _toString = Function.prototype.toString
Function.prototype.toString = function toString(){
    return _toString.call(this).replace(/\\(?:u([0-9a-f]{4})|x([0-9a-f]{2}))/g, (_, p) => String.fromCharCode(parseInt(p, 16)))
}
return {}
})()