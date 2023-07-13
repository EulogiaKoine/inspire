"use strict"
module.exports = {
    legacy_adaptor(legacy_ev, msg){
        legacy_ev(
            msg.room,
            msg.content,
            msg.author.name,
            msg.isGroupChat,
            msg,
            Object.assign(msg.author.avatar, { getProfileHash(){ return java.lang.String(this.getBase64()).hashCode() }}),
            msg.packageName,
            msg.isDebugRoom,
            msg.isMention
        )
    }
}