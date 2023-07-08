"use strict"
module.exports = (function(){
const SDF = java.text.SimpleDateFormat
function format(p){
    if(typeof p === "string")
        return SDF(p).format(this)
    return this.toString()
}
if(!Date.prototype.format) Object.defineProperty(Date.prototype, 'format', {
    value: format,
    writable: true,
    configurable: true
})
return {}
})()