module.exports = function(path, r_inspire, _global){

let ENV = null
if(typeof Api === "object" && typeof BotManager === "undefined") ENV = 1
else if(typeof Api === "undefined" && typeof BotManager === "object") ENV = 2
else throw new Error("evaluate - Unexpected Environment Error; please contact to the developer")

const config = r_inspire('config')
const ParameterType = {
    LEGACY: Symbol(1),
    API2: Symbol(2)
}
const rp_constructor = r_inspire('rp_constructor').rp_constructor
let legacy_adaptor = null
let api2_adaptor = null
let legacy_evaluator = null
let api2_evaluator = null

let legacy2legacy = function listener(room, msg, sender, isGroupChat, replier, imageDB, packageName){
    legacy_evaluator(room, msg, sender, isGroupChat, replier, imageDB, packageName, packageName === 'com.xfl.msgbot')
}
let legacy2api2 = function listener(room, msg, sender, isGroupChat, replier, imageDB, packageName){
    api2_adaptor(api2_evaluator, room, msg, sender, isGroupChat, replier, imageDB, packageName)
}
let api22legacy = function listener(msg){
    legacy_adaptor(legacy_evaluator, msg)
}

const evaluate = {
    ParameterType: ParameterType,
    room: config.room,
    hash: config.hash
}

Object.defineProperty(evaluate, 'prefix', {
    get(){
        return config.prefix
    },
    set(p){
        if(typeof p === "string" || p === null) config.prefix = p
        else throw new TypeError('evaluate.prefix must be a string or null')
    },
    enumerable: true
})

evaluate.getListener = function(type){
    if(type === ParameterType.LEGACY){
        if(!legacy_evaluator) legacy_evaluator = r_inspire('legacy_evaluator').evaluator
        if(ENV === 1) return legacy2legacy
        if(!legacy_adaptor) legacy_adaptor = r_inspire('legacy_adaptor').legacy_adaptor
        return api22legacy
    } else if(type === ParameterType.API2){
        if(!api2_evaluator) api2_evaluator = r_inspire('api2_evaluator').evaluator
        if(ENV === 1){
            if(!api2_adaptor) api2_adaptor = r_inspire('api2_adaptor').api2_adaptor
            return legacy2api2
        }
        return api2_evaluator
    }
    throw new TypeError("evaluate.getListener - please check the Parameter type inputed to 1st argument")
}

Object.defineProperty(evaluate, 'max_reply_count', {
    get(){ return rp_constructor.count },
    set(c){ rp_constructor.count = c },
    enumerable: true
})

if(ENV === 2){
    Object.defineProperty(evaluate, '$running', {
        value: null,
        writable: true
    })
    evaluate.on = function on(type){
        const bot = BotManager.getCurrentBot()
        if(this.$running && bot.listeners(Event.MESSAGE).includes(this.$running)) return false
        const listener = this.getListener(type)
        if(bot.listeners(Event.MESSAGE).includes(listener)) return false
        bot.addListener(Event.MESSAGE, this.$running = listener)
        return true
    }
    evaluate.off = function off(){
        const bot = BotManager.getCurrentBot()
        const listeners = bot.listeners(Event.MESSAGE)
        if(this.$running || listeners.includes(api22legacy) || listeners.includes(api2_evaluator)){
            this.$running = null
            bot.removeListener(Event.MESSAGE, api22legacy)
            bot.removeListener(Event.MESSAGE, api2_evaluator)
            return true
        }
        return false
    }
}

if(!_global.evaluate) _global.evaluate = evaluate
return evaluate
}