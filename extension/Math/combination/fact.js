"use strict"
module.exports = (function(){
function factorial(n){
    if(typeof n === 'number' && n >= 0){
        let r = 1;
        while(n) r *= n--;
        return r;
    }
    throw new TypeError("Math.fact - arguments must be an integer or a zero")
}
if(!Math.fact) Math.fact = factorial
return { fact: factorial }
})()