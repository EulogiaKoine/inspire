module.exports = function(path, r_inspire){
return {
    Promise: r_inspire('Promise').Promise,
    ThreadManager: r_inspire("ThreadManager")
}
}