"use strict"
module.exports = (function(){
function randint(a, b){
    if(b === void 0)
        return Math.floor(Math.random() * (a+1))
    return Math.floor(Math.random()*(b-a+1) + a)
}
if(!Math.randint) Math.randint = randint
return { randint: randint }
})()