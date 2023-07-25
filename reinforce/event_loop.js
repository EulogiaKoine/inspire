"use strict"
module.exports = function(path, r_inspire, _global){
inspire('util.ThreadManager')

const MAIN_THREAD = 'Main'

if(!ThreadManager.exists(MAIN_THREAD)){
    ThreadManager.create(MAIN_THREAD)
    ThreadManager.start(MAIN_THREAD)
}

const TimerTask = java.util.TimerTask
const timer = new java.util.Timer(true)
const record = {}
let $id = 0

const _splice = Array.prototype.splice

function setTimeout(fn, delay, arg1){
    if(typeof fn === 'function'){
        const id = ++$id
        let task
        if(arg1){
            const args = _splice.call(arguments, 2)
            task = new TimerTask({ run(){
                ThreadManager.run(MAIN_THREAD, () => fn.apply(_global, args))
                delete record[id]
            }})
        } else {
            task = new TimerTask({ run(){
                ThreadManager.run(MAIN_THREAD, fn)
                delete record[id]
            }})
        }
        timer.schedule(task, Math.floor(delay) || 0)
        record[id] = task
        return id
    }
    throw new TypeError("setTimeout - 1st argument must be a function")
}

function setInterval(fn, delay, arg1){
    if(typeof fn === 'function'){
        const id = ++$id
        let task
        if(arg1){
            const args = _splice.call(arguments, 2)
            task = new TimerTask({ run(){
                ThreadManager.run(MAIN_THREAD, () => fn.apply(_global, args))
            }})
        } else {
            task = new TimerTask({ run(){
                ThreadManager.run(MAIN_THREAD, fn)
            }})
        }
        delay = Math.floor(delay) || 0;
        timer.schedule(task, delay, delay)
        record[id] = task
        return id
    }
    throw new TypeError("setInterval - 1st argument must be a function")
}

function clear(id){
    if(id in record){
        record[id].cancel()
        timer.purge()
        return delete record[id]
    }
    return false
}

_global.setTimeout = setTimeout
_global.setInterval = setInterval
_global.clearTimeout = clear
_global.clearInterval = clear

return Object.freeze({
    MAIN_THREAD: MAIN_THREAD,
    setTimeout: setTimeout,
    clearTimeout: clear,
    setInterval: setInterval,
    clearInterval: clear
})
}