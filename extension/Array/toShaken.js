"use strict"
module.exports = function(path, r_inspire){
r_inspire('shake')
if(!Array.prototype.toShaken) Object.defineProperty(Array.prototype, 'toShaken', {
    value(e, s){
        return this.slice().shake(e, s)
    },
    writable: true, configurable: true
})
return {}
}