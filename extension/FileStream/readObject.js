"use strict"
module.exports = (function(){
function readObject(path){
    return JSON.parse(FileStream.read(path))
}
if(typeof FileStream === 'function' && !FileStream.readObject)
    FileStream.readObject = readObject
return { readObject: readObject }
})()