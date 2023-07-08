"use strict"
module.exports = (function(){
function lerp(a, b, t){
    return (b-a)*t+a
}
if(!Math.lerp) Math.lerp = lerp
return { lerp: lerp }
})