module.exports = function($$$, $r_inspire, $global){
const $rp_constructor = $r_inspire('rp_constructor').rp_constructor
const $nanoTime = java.lang.System.nanoTime
const $style = $r_inspire('style')
const $config = $r_inspire('config')
const $room = $config.room
const $hash = $config.hash

const { setTimeout, clearTimeout, setInterval, clearInterval, toast } = $r_inspire('native_binder')

function legacy_evaluator(room, msg, sender, isGroupChat, replier, imageDB, packageName, isDebugRoom, isMention){
    if(isDebugRoom || msg.startsWith($config.prefix) && !(isGroupChat && $room.indexOf(room) === -1) && $hash.indexOf(imageDB.getProfileHash()) !== -1){
        let rp = $rp_constructor(replier)
        let $code = msg.slice($config.prefix.length)

        try{
            let $timeout
            const $result = eval(
                "void ($timeout = $nanoTime());\n"
                + $code
            )
            replier.reply($style.result(Math.max(0, $nanoTime() - $timeout - 5000) / 1000000000, $result))
        } catch(e) {
            replier.reply($style.error(e))
        }
    }
}

return { evaluator: legacy_evaluator.bind($global) }
}