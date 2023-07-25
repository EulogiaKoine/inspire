"use strict"
module.exports = (function(){
inspire('util.ThreadManager')
const SEND_THREAD = 'MESSAGE_SENDER'
ThreadManager.create(SEND_THREAD)
ThreadManager.start(SEND_THREAD)
let send
if(typeof Api === 'undefined' && typeof BotManager === 'object'){
    const bot = BotManager.getCurrentBot()
    let _send = bot.send.bind(bot)
    send = ThreadManager.sync(SEND_THREAD, (room, msg) => _send(room, msg))
    bot.send = send
} else if(typeof Api === 'object' && typeof BotManager === 'undefined'){
    let _send = Api.replyRoom.bind(Api)
    send = ThreadManager.sync(SEND_THREAD, (room, msg) => _send(room, msg))
    Api.replyRoom = send
} else {
    throw new InternalError("send - Api1, Api2 모두 아닌 환경에서 실행되었습니다.")
}
return Object.freeze({
    SEND_THREAD: SEND_THREAD,
    send: send
})
})()