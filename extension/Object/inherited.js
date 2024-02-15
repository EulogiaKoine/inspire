"use strict"
module.exports = function(_, r_inspire){
r_inspire('getOwnPropertyDescriptors')
function inherited(o, Class){
    if(typeof o === 'object' && typeof Class === 'function')
        return Object.create(Class.prototype || {}, Object.getOwnPropertyDescriptors(o))
    throw new TypeError("assertion typeof o == 'object' and Class is a constructor function")
}
if(!Object.inherited) Object.inherited = inherited
return {inherited:inherited}
}