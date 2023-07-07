"use strict"
module.exports = function(path, r_inspire, _global){

let ignoranceLevel = 0

function assert(condition, msg, level){
    if(level === void 0 || level >= ignoranceLevel){
        if(typeof condition === "function"){
            if(!condition()){
                let e = new Error(msg)
                Error.captureStackTrace(e)
                e.stack = e.stack.split('\n').slice(1).join('\n')
                throw e
            }
        } else if(!condition){
            let e = new Error(msg)
            Error.captureStackTrace(e)
            e.stack = e.stack.split('\n').slice(1).join('\n')
            throw e
        }
    }
}

/**
 * @interface
 */
Object.defineProperty(assert, 'ignoranceLevel', {
    get(){
        return ignoranceLevel
    },
    set(level){
        level = +level >> 0
        assert(typeof level === "number" && level >= 0, "level must be an integer that equals or greater than 0")
        ignoranceLevel = level
    },
    enumerable: true,
    configurable: true
})

if(!_global.assert) _global.assert = assert

return {
    assert: assert
}
}