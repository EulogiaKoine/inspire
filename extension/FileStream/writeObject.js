"use strict"
module.exports = (function(){
function writeObject(path, data){
    FileStream.write(path, JSON.stringify(data))
}
if(typeof FileStream === 'function' && !FileStream.writeObject)
    FileStream.writeObject = writeObject
return { writeObject: writeObject }
})()