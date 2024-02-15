"use strict"
module.exports = (function(){
function getOwnPropertyDescriptors(o){
    const res = {}
    for(let k of Object.getOwnPropertyNames(o))
        res[k] = Object.getOwnPropertyDescriptor(o, k)
    return res
}
if(!Object.getOwnPropertyDescriptors) Object.getOwnPropertyDescriptors = getOwnPropertyDescriptors
return { getOwnPropertyDescriptors: getOwnPropertyDescriptors }
})