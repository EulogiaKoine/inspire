"use strict"
module.exports = function(path, r_inspire){
return {
    send: r_inspire('send'),
    event_loop: r_inspire('event_loop')
}
}