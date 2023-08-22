"use strict"
module.exports = function($, $$, _global){

/**
 * @author Koinē
 * @version 1.0 2023-08-18
 * 
 * thanks to DarkTornado, archetic, DEViolet, Regret, 옾챝봇
 */ 

const Companion = com.xfl.msgbot.application.service.NotificationListener.Companion
const ImageDB = com.xfl.msgbot.script.api.legacy.ImageDB
const SpannableString = android.text.SpannableString

/** @assert this instanceof Chat === true  ⇔  used with new keyword*/
var Chat

function bindSession(pack, room, acts){
    if(!Companion.hasSession(pack, room)){
        Companion.setSession(pack, room, acts.find(v => v.getRemoteInputs()))
        Companion.setMarkAsRead(pack, room, acts.find(v => !v.getRemoteInputs()))
    }
}

// 안드로이드 버전 11 미만
if(android.os.Build.VERSION.SDK_INT < 30){
    function Chat(sbn){
        if(sbn && sbn.getNotification()){
            const pack = sbn.getPackageName()
            const actions = sbn.getNotification().actions
            if(actions && pack.startsWith('com.kakao.t')){
                this.sbn = sbn
                this.packageName = pack
                const e = sbn.getNotification().extras
                this.sender = e.getString("android.title") || e.getString("android.title.big")
                this.isGroupChat = (this.room = e.getString("android.subText")) !== null
                bindSession(pack,
                    this.room = this.room || this.sender,
                    actions)
                this.msg = e.get("android.text").toString()
                return this
            }
            return {
                packageName: pack,
                isKakaoChat: false
            }
        }
        throw new TypeError("Chat - argument must be a StatusBarNotification")
    }

    Object.defineProperty(Chat.prototype, 'imageDB', {
        get(){
            return new ImageDB(this.sbn.getNotification().extras.get("android.largeIcon"), null)
        }
    })

    Object.defineProperty(Chat.prototype, 'isMention', {
        get(){
            return this.sbn.getNotification().extras.get("android.text") instanceof SpannableString
        }
    })
}

// 안드로이드 버전 11 이상
else {
    function Chat(sbn){
        if(sbn && sbn.getNotification()){
            const pack = sbn.getPackageName()
            const actions = sbn.getNotification().actions
            if(actions && pack.startsWith('com.kakao.t')){
                this.sbn = sbn
                this.packageName = pack
                const e = sbn.getNotification().extras
                this.sender = e.getString("android.title") || e.getParcelableArray("android.messages")[0].getString("sender")
                bindSession(pack, this.room = e.getString("android.subText") || this.sender, actions)
                this.msg = (e.get("android.text") || e.getParcelableArray("android.messages")[0].get("text")).toString()
                this.isGroupChat = e.getBoolean("android.isGroupConversation")
                return this
            }
            return {
                packageName: pack,
                isKakaoChat: false
            }
        }
        throw new TypeError("Chat - argument must be a StatusBarNotification")
    }

    Object.defineProperty(Chat.prototype, 'imageDB', {
        get(){
            return new ImageDB(this.sbn.getNotification().extras.getParcelableArray("android.messages")[0]
            .get("sender_person").getIcon().getBitmap(), null)
        }
    })

    Object.defineProperty(Chat.prototype, 'isMention', {
        get(){
            const e = this.sbn.getNotification().extras
            return (e.get("android.text") || e.getParcelableArray("android.messages")[0].get("text")) instanceof SpannableString
        }
    })

    Object.defineProperty(Chat.prototype, 'userId', {
        get(){
            if(this.$userId) return this.$userId
            return this.$userId = this.sbn.getNotification().extras.getParcelableArray('android.messages')[0]
                .get('sender_person').getKey()
        }
    })
}

Object.defineProperty(Chat, 'toString', {
    value(){
        return 'function Chat(StatusBarNotification){\n\t[inspired module, arity=1]\n}'
    }
})

Object.defineProperty(Chat.prototype, 'isKakaoChat', {
    value: true
})

Object.defineProperty(Chat.prototype, 'toString', {
    value(){ return "[object Chat]" }
})

Object.defineProperty(Chat.prototype, 'profileHash', {
    get(){
        if(this.$hash) return this.$hash
        return this.$hash = this.imageDB.getProfileHash()
    }
})

Object.defineProperty(Chat.prototype, 'roomId', {
    get(){ return this.sbn.getTag() }
})

Object.defineProperty(Chat.prototype, 'isMultiChat', {
    get(){ return this.sbn.getUser().hashCode() !== 0 }
})

if(typeof Api === "object" && typeof Api.replyRoom === "function"){
    Object.defineProperties(Chat.prototype, {
        reply: {
            value(m){ Api.replyRoom(this.room, m, true) }
        },
        markAsRead: {
            value(){ return Api.markAsRead(this.room) }
        }
    })

    const Replier = com.xfl.msgbot.script.api.legacy.SessionCacheReplier
    Object.defineProperty(Chat, 'respond', {
        value(sbn, listener){
            if(typeof listener === "function"){
                const chat = new Chat(sbn)
                if(chat.isKakaoChat){
                    listener(
                        chat.room,
                        chat.msg,
                        chat.sender,
                        chat.isGroupChat,
                        new Replier(chat.packageName, chat.sbn.getNotification().actions.find(v => v.remoteInputs), chat.room, false, ''),
                        chat.imageDB,
                        chat.packageName,
                        chat.isMultiChat,
                        chat.isMention,
                        chat.roomId
                    )
                }
            } else {
                throw new TypeError("Chat.respond - 2nd argument must be a function")
            }
        },
        enumerable: true
    })
} else {
    const bot = BotManager.getCurrentBot()
    Object.defineProperties(Chat.prototype, {
        reply: {
            value(m){ bot.send(this.room, m, true) }
        },
        markAsRead: {
            value(){ return bot.markAsRead(this.room) }
        }
    })
}


if(!_global.Chat) _global.Chat = Chat
return { Chat: Chat }
}