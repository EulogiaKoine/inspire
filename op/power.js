"use strict"
module.exports = {
    boost(){
        Device.acquireWakeLock(android.os.PowerManager.PARTIAL_WAKE_LOCK, '')
    },
    rest(){
        Device.releaseWakeLock()
    }
}