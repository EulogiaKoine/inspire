"use strict"
/**
 * @description
 * evaluate 모듈 스코프에서 실행한 eval() 내에서 내장 함수가 전역에 바인딩되어있어야 하는 문제 해결용
 * feat. 지역변수 하나도 안 남기려는 자의 발악
 */
module.exports = function(path, r_inspire, _global){
return ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'toast'].map(native => {
    if(native in _global){
        if(/function .+\(\) \{\n\t\[native code, arity\=[1-9]+\]\n\}/.test(_global[native].toString()))
            return [native, _global[native].bind(_global)]
        else
            return [native, _global[native]]
    } else throw new InternalError("please contact to the developer")
}).reduce((acc, nat) => {
    acc[nat[0]] = nat[1]
    return acc
}, {})
}