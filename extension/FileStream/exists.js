"use strict"
module.exports = (function(){
function exists(path){
    return java.io.File(path).exists()
}
if(typeof FileStream === 'function' && !FileStream.exists)
    FileStream.exists = exists
return { exists: exists }
})()