"use strict"
module.exports = function(path, r_inspire, _global){
const pool = {}
function loopGenerator(q, f){
    return function(){
        let t
        while(true){
            try{
                t = q.take()
                if(f.stop){ // 정지 후 큐 복구
                    const tq = q.toArray()
                    q.clear()
                    q.put(t)
                    tq.forEach(v => q.put(v))
                    f.stop = false
                    return
                }
                t()
            }catch(e){
                Log.e(e)
            }
        }
    }
}

const ThreadManager = Object.freeze({
    create(name){
        if(name in pool)
            throw new Error("ThreadManager.create - ThreadManager '"+name+"' already exists")
        pool[name] = {
            queue: new java.util.concurrent.LinkedBlockingQueue(),
            thread: null,
            flag: {stop: false}
        }
    },

    start(name){
        if(name in pool){
            if(pool[name].thread === null){
                pool[name].thread = new java.lang.Thread({
                    run: loopGenerator(pool[name].queue, pool[name].flag)
                })
                pool[name].thread.start()
            } else {
                throw new Error("ThreadManager.start - ThreadManager '"+name+"' is now running")
            }
        } else {
            throw new Error("ThreadManager.start - ThreadManager '"+name+"' doesn't exists")
        }
    },

    isAlive(name){
        if(name in pool)
            return pool[name].thread !== null && pool[name].thread.alive
        throw new Error("ThreadManager.isAlive - ThreadManager '"+name+"' doesn't exists")
    },

    stop(name){
        if(name in pool){
            pool[name].flag.stop = true
            pool[name].thread = null
        } else {
            throw new Error("ThreadManager.stop - ThreadManager '"+name+"' doesn't exists")
        }
    },

    remove(name){
        if(name in pool){
            if(this.isAlive(name))
                this.stop(name)
            delete pool[name]
        } else {
            throw new Error("ThreadManager.remove - ThreadManager '"+name+"' doesn't exists")
        }
    },

    run(name, fn){
        if(name in pool){
            if(typeof fn === 'function'){
                pool[name].queue.put(fn)
            } else {
                throw new Error("ThreadManager.run - 2nd argument must be a function; "+fn)
            }
        } else {
            throw new Error("ThreadManager.run - ThreadManager '"+name+"' doesn't exists")
        }
    },

    sync(name, fn){
        if(name in pool){
            if(typeof fn === 'function'){
                return function(){
                    if(name in pool) pool[name].queue.put(() => fn.apply(this, arguments))
                    else throw new Error("ThreadManager.sync/fn - ThreadManager '" + name + "' has been removed")
                }
            } else {
                throw new Error("ThreadManager.sync - 2nd argument must be a function; "+fn)
            }
        } else {
            throw new Error("ThreadManager.sync - ThreadManager '"+name+"' doesn't exists")
        }
    },

    clearTask(name){
        if(name in pool){
            pool[name].queue.clear()
        } else {
            throw new Error("ThreadManager.clearTask - ThreadManager '"+name+"' doesn't exists")
        }
    },

    taskCount(name){
        if(name in pool){
            return pool[name].queue.size()
        } else {
            throw new Error("ThreadManager.taskCount - ThreadManager '"+name+"' doesn't exists")
        }
    },

    exists(name){ return name in pool },

    list(){ return Object.keys(pool) },

    stopAll(){
        for(let thread in pool){
            if(this.isAlive(thread))
                this.stop(thread)
        }
    },

    $pool: pool
})

if(!_global.ThreadManager) _global.ThreadManager = ThreadManager
return ThreadManager
}