"use strict"
module.exports = (function(){
const SDF = java.text.SimpleDateFormat
function fromFormat(s, f){
    if(typeof f === "string") return new Date(new SDF(f).parse(s))
    return new Date(s)
}
if(!Date.fromFormat) Date.fromFormat = fromFormat
return { fromFormat: fromFormat }
})()