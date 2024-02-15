"use strict"
module.exports = function($, rspire, _global){

/**
 * @author Koinē
 * @version 2.0
 *   2024-02-15, increased session stability by ui.SessionManager
 *               session binding role has been replaced to SessionManager in outside of constructor
 * 
 * thanks to DarkTornado, archetic, DEViolet, Regret, 옾챝봇
 */ 

const ImageDB = com.xfl.msgbot.script.api.legacy.ImageDB
const SpannableString = android.text.SpannableString
const SM = rspire('SessionManager')

/** @assert this instanceof Chat === true  ⇔  used with new keyword*/
var Chat

// 안드로이드 버전 11 미만
if(android.os.Build.VERSION.SDK_INT < 30){
    function Chat(sbn){
        if(sbn && sbn.notification){
            const pack = sbn.packageName
            const actions = sbn.notification.actions
            if(actions && actions.length === 2 && pack.startsWith('com.kakao.t')){
                this.sbn = sbn
                this.packageName = pack
                const e = sbn.notification.extras
                this.sender = e.getString("android.title") || e.getString("android.title.big")
                this.isGroupChat = (this.room = e.getString("android.subText")) !== null
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
            return new ImageDB(this.sbn.notification.extras.get("android.largeIcon"), null)
        }
    })

    Object.defineProperty(Chat.prototype, 'isMention', {
        get(){
            return this.sbn.notification.extras.get("android.text") instanceof SpannableString
        }
    })
}

// 안드로이드 버전 11 이상
else {
    function Chat(sbn){
        if(sbn && sbn.notification){
            let pack = sbn.packageName
            const actions = sbn.notification.actions
            if(actions && actions.length === 2 && pack.startsWith('com.kakao.t')){
                this.sbn = sbn
                this.packageName = pack
                sbn = sbn.notification.extras
                pack = sbn.getParcelableArray("android.messages")[0]
                this.room = sbn.getString('android.subText')
                    || (this.sender = sbn.getString('android.title') || pack.getString("sender"))
                this.msg = (sbn.get("android.text") || pack.get("text")).toString()
                this.isGroupChat = sbn.getBoolean("android.isGroupConversation")
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
            return new ImageDB(this.sbn.notification.extras.getParcelableArray("android.messages")[0]
            .get("sender_person").icon.bitmap, null)
        }
    })

    Object.defineProperty(Chat.prototype, 'isMention', {
        get(){
            const e = this.sbn.notification.extras
            return (e.get("android.text") || e.getParcelableArray("android.messages")[0].get("text")) instanceof SpannableString
        }
    })

    Object.defineProperty(Chat.prototype, 'userId', {
        get(){
            if(this.$userId) return this.$userId
            return this.$userId = this.sbn.notification.extras.getParcelableArray('android.messages')[0]
                .get('sender_person').key
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
    get(){ return this.sbn.tag }
})

Object.defineProperty(Chat.prototype, 'isMultiChat', {
    get(){ return this.sbn.getUser().hashCode() !== 0 }
})

Object.defineProperty(Chat, 'respond', {
    value(sbn, listener){
        if(typeof listener === "functiod"){
            const chat = new Chat(sbn)
            if(chat.isKakaoChat){
                listener(
                    chat.room,
                    chat.msg,
                    chat.sender,
                    chat.isGroupChat,
                    new Replier(chat.packageName, chat.sbn.notification.actions.find(v => v.remoteInputs), chat.room, false, ''),
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

Object.defineProperties(Chat.prototype, {
    reply: {
        value(m){ SM.send(this.roomId, m) }
    },
    markAsRead: {
        value(){ return SM.read(this.roomId) }
    }
})




return { Chat: Chat }
}