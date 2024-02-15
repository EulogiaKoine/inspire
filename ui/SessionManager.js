/**
 * @name SessionManager
 * @author E. Koinē
 * @license MIT
 * @version 1.0.0
 * @update 2024-02-14
 * 
 * @description
 *  채팅 알림의 답장/읽음 기능을 원하는 Key와 함께 직접 등록하고 사용할 수 있도록 지원합니다.
 *  카톡에서의 사용만을 염두에 둔 점 유의 부탁드립니다.
 */

module.exports = (function(){

const Context = android.content.Context
const Intent = android.content.Intent
const Bundle = android.os.Bundle
const RemoteInput = android.app.RemoteInput

const isLegacy = typeof Api === "object" && Api.getContext() instanceof Context
const ctx = isLegacy? Api.getContext(): App.getContext()
// Companion = com.xfl.msgbot.application.service.NotificationListener.Companion

// ss { key: { remoteInputs, actionIntent } }
// rs { key: actionIntent }
const ss = {}, rs = {} // ss: send session, rs: read session


/** @assert key in ss => ss[key].remoteInputs instanceof List<RemoteInput> */
function send(key, msg){
    if(key in ss){
        try{
            const int = Intent(), txt = Bundle();
            (key = ss[key]).remoteInputs.forEach(v => txt.putCharSequence(v.resultKey, String(msg)))
            RemoteInput.addResultsToIntent(key.remoteInputs, int, txt)
            key.actionIntent.send(ctx, 0, int)
            return true
        } catch(e) {
            Error.captureStackTrace(e)
            Log.e(e + e.stack)
        }
    }
    return false
}

/** @assert key in rs => rs[key].remoteInputs == null */
function read(key){
    if(key in rs){
        try{
            rs[key].send(ctx, 0, null)
            return true
        } catch(e) {
            Error.captureStackTrace(e)
            Log.e(e + e.stack)
        }
    }
    return false
}


const $Action = android.app.Notification$Action
function setSendSession(key, ses){
    if(key){
        if(ses instanceof $Action && ses.remoteInputs !== null){
            ss[key] = {
                remoteInputs: ses.remoteInputs,
                actionIntent: ses.actionIntent /** @type {android.app.PendingIntent} asserted */
            }
            return
        }
        throw new TypeError("SessionManager.setSendSession - the session isn't able to send(reply)")
    }
    throw new TypeError("SessionManager.setSendSession - plz input key")
}

function setReadSession(key, ses){
    if(key){
        if(ses instanceof $Action && ses.remoteInputs === null){
            ss[key] = ses.actionIntent /** @type {android.app.PendingIntent} asserted */
            return
        }
        throw new TypeError("SessionManager.setReadSession - the session isn't able to read")
    }
    throw new TypeError("SessionManager.setReadSession - plz input key")
}


function hasSendSession(key){
    return key in ss
}
function hasReadSession(key){
    return key in rs
}

function getSendSession(key){
    return key in ss? Object.assign({}, ss[key]): null
}
function getReadSession(key){
    return key in rs? Object.assign({}, rs[key]): null
}


const SBN = android.service.notification.StatusBarNotification
function getSessionsFromSBN(sbn){
    if(sbn && 'getClass' in sbn && sbn.getClass() === SBN){
        sbn = sbn.notification.actions // 재활용
        if(sbn === null || sbn.length !== 2)
            return null
        const i = sbn[1].remoteInputs !== null
        return {
            send: sbn[+i],
            read: sbn[+!i]
        }
    }
    return null
}

function setSessionBySBN(key, sbn){
    if(key){
        if(sbn && 'getClass' in sbn && sbn.getClass() === SBN){
            sbn = sbn.notification.actions
            if(sbn === null || sbn.length !== 2)
                return false
            const i = sbn.findIndex(v => v.remoteInputs !== null)
            if(i === -1)
                return false
            const send = sbn[i]
            ss[key] = {
                remoteInputs: send.remoteInputs,
                actionIntent: send.actionIntent
            }
            rs[key] = sbn[+!i].actionIntent
            return true
        }
        throw new TypeError("SessionManager.setReadSession - the session isn't able to read")
    }
    throw new TypeError("SessionManager.setSessionBySBN - plz input key")
}


function getSendKeys(){
    return Object.keys(ss)
}
function getReadKeys(){
    return Object.keys(rs)
}


function getAllSendSessions(){
    return Object.keys(ss).map(v => ({
        key: v,
        session: Object.assign({}, ss[key])
    }))
}
function getAllReadSessions(){
    return Object.keys(rs).map(v => ({
        key: v,
        session: { actionIntent: rs[key] }
    }))
}
function getAllSessions(){
    const t = {}
    for(let key in ss){
        t[key] = {
            send: Object.assign({}, ss[key]),
            read: null
        }
    }
    for(let key in rs){
        if(key in t)
            t[key].read = { actionIntent: rs[key] }
        else
            t[key] = {
                send: null,
                read: { actionIntent: rs[key] }
            }
    }
    return Object.keys(t).map(v => Object.assign(t[v], { key: v }))
}


function bringSessionsFromApp(package){
    const Companion = com.xfl.msgbot.application.service.NotificationListener.Companion
    package = typeof package === "string"? package: "com.kakao.talk"
    let res, t
    return Array.from(Companion.getRooms(package))
        .map(v => {
            if((t = Companion.getSession(package, v)) === null || t.remoteInputs === null)
                return {
                    key: v,
                    send: null,
                    read: Companion.getMarkAsRead(package, v)
                }
            else
                return {
                    key: v,
                    send: t,
                    read: Companion.getMarkAsRead(package, v)
                }
        })
}



const KeyType = Object.freeze({
    ROOM_ID: 1,
    ROOM_NAME: 2,
    SENDER_NAME: 3,
    PROFILE_HASH: 4
})

const ImageDB = com.xfl.msgbot.script.api.legacy.ImageDB
function generateAutoApplier(){
    arguments = Array.from(arguments)
    const RI = arguments.includes(KeyType.ROOM_ID), RN = arguments.includes(KeyType.ROOM_NAME),
          SN = arguments.includes(KeyType.SENDER_NAME), PH = arguments.includes(KeyType.PROFILE_HASH)
    if(!(RI || RN || SN || PH))
        throw new TypeError("SessionManager.autoApplier - plz input key type you want to applied automatically")
    return function sessionApplyListener(sbn){
        if(sbn.packageName === "com.kakao.talk" && sbn.tag !== null){
            const acts = sbn.notification.actions
            if(acts && acts.length === 2){
                let send, read, key
                acts.forEach(v => {
                    if(v.remoteInputs === null)
                        read = v
                    else
                        send = v
                })
                if(send === null || read === null)
                    return

                // 방ID
                if(RI){
                    ss[key = sbn.tag] = {
                        remoteInputs: send.remoteInputs,
                        actionIntent: send.actionIntent
                    }
                    rs[key] = read.actionIntent
                }

                sbn = sbn.notification.extras
                const m = sbn.getParcelableArray("android.messages")[0]

                // 방 이름
                if(RN){
                    ss[key = sbn.getString("android.subText") || sbn.getString("android.title") || m.getString("sender")] = {
                        remoteInputs: send.remoteInputs,
                        actionIntent: send.actionIntent
                    }
                    rs[key] = read.actionIntent
                }

                // 보낸사람 이름
                if(SN){
                    ss[key = sbn.getString("android.title") || m.getString("sender")] = {
                        remoteInputs: send.remoteInputs,
                        actionIntent: send.actionIntent
                    }
                    rs[key] = read.actionIntent
                }

                // 프사 해시코드
                if(PH){
                    ss[key = new ImageDB(m.get('sender_person').icon.bitmap, null).profileHash] = {
                        remoteInputs: send.remoteInputs,
                        actionIntent: send.actionIntent
                    }
                    rs[key] = read.actionIntent
                }
            }
        }
    }
}



let T = null, Q = null, $flag = true
function send_optimized(key, msg){ /** @assert Q instanceof java.util.concurrent.LinkedBlockingQueue */
    if(key in ss){
        Q.put([key, String(msg)])
        return true
    }
    return false
}
function _optimize(on){
    if(on || on === void 0){
        if(T === Q){ // null일 때만 해당
            Q = new java.util.concurrent.LinkedBlockingQueue()
            T = new java.lang.Thread({ run(){
                let r, key, int, txt
                while($flag){
                    r = Q.take()
                    key = r[0]
                    int = Intent()
                    txt = Bundle()
                    try{ /** @assert key in ss 'cause it only relies on request of send_optimized() */
                        (key = ss[key]).remoteInputs.forEach(v => txt.putCharSequence(v.resultKey, r[1]))
                        RemoteInput.addResultsToIntent(key.remoteInputs, int, txt)
                        key.actionIntent.send(ctx, 0, int)
                    } catch(e) {
                        Error.captureStackTrace(e)
                        Log.e(e + e.stack)
                    }
                }
                $flag = true // while문 빠져나오고 자동으로 갱신
            } })
            T.setDaemon(true)
            T.start()
            return true
        }
        return false
    } else {
        if(T === Q) // 이미 꺼짐
            return false
        $flag = false
        T = null
        Q = null
    }
}







return Object.seal({
    /** @private */
    $sendmap: ss,
    $readmap: rs,

    /** @public */
    send: send,
    read: read,

    setSendSession: setSendSession,
    setReadSession: setReadSession,
    hasSendSession: hasSendSession,
    hasReadSession: hasReadSession,
    getSendSession: getSendSession,
    getReadSession: getReadSession,
    getSessionsFromSBN: getSessionsFromSBN,
    setSessionBySBN: setSessionBySBN,

    getSendKeys: getSendKeys,
    getReadKeys: getReadKeys,
    getAllSendSessions: getAllSendSessions,
    getAllReadSessions: getAllReadSessions,
    getAllSessions: getAllSessions,

    bringSessionsFromApp: bringSessionsFromApp,

    KeyType: KeyType,
    autoApplier: generateAutoApplier,

    get $thread(){ return T },
    get $queue(){ return Q },
    optimize(on){
        if(on || on === void 0){
            if(_optimize(on)){
                this.send = send_optimized
                return true
            }
        } else if(_optimize(on)){
            this.send = send
            return true
        }
        return false
    }
})
})()