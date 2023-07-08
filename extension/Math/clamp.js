"use strict"
module.exports = (function(){
function clamp(value, min, max){
    return value < min? min: max < value? max: value
}
if(!Math.clamp) Math.clamp = clamp
return { clamp: clamp }
})()