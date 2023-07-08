"use strict"
module.exports = (function(){
if(!Array.prototype.counts) Object.defineProperty(Array.prototype, 'counts', {
    value(req){
        if(Array.isArray(req)){
            let r = new Map(), v
            for(let e of req)
                r.set(e, 0)
            for(let e of this){
                v = r.get(e)
                if(v !== void 0)
                    r.set(e, v+1)
            }
            return r
        }
        if(req !== void 0)
            throw new TypeError("paramenter must be an array or undefined")
        let r = new Map(), v
        for(let e of this){
            v = r.get(e)
            if(v === void 0) r.set(e, 1)
            else r.set(e, v+1)
        }
        return r
    }
})
return {}
})()