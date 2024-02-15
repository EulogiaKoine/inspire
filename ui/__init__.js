"use strict"
module.exports = function(path, r_inspire){
return {
    SessionManager: r_inspire('SessionManager'),
    Chat: r_inspire('Chat').Chat
}
}