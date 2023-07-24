"use strict"
module.exports = function(path, r_inspire){
return {
    exists: r_inspire('exists').exists,
    isDirectory: r_inspire('isDirectory').isDirectory,
    readObject: r_inspire('readObject').readObject,
    writeObject: r_inspire('writeObject').writeObject
}
}