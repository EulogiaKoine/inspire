"use strict"
module.exports = (function(){
function isDirectory(path){
    return java.io.File(path).isDirectory()
}
if(typeof FileStream === 'function' && !FileStream.isDirectory)
    FileStream.isDirectory = isDirectory
return { isDirectory: isDirectory }
})()