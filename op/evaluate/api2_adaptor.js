"use strict"
module.exports = {
    api2_adaptor(api2_ev, room, msg, sender, isGroupChat, replier, imageDB, packageName){
        api2_ev({
            room: room,
            content: msg,
            author: {
                name: sender,
                avatar: { getBase64(){ return imageDB.getProfileBase64() }}
            },
            isGroupChat: isGroupChat,
            isDebugRoom: packageName === "com.xfl.msgbot",
            packageName: packageName,
            reply(m){ replier.reply(m) }
        })
    }
}