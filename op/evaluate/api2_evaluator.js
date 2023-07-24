module.exports = function($path, $r_inspire, $global){
const $rp_constructor = $r_inspire('rp_constructor').rp_constructor
const $nanoTime = java.lang.System.nanoTime
const $style = $r_inspire('style')
const $config = $r_inspire('config')
const $room = $config.room
const $hash = $config.hash

let { setTimeout, clearTimeout, setInterval, clearInterval, toast } = $r_inspire('native_binder')

function api2_evaluator(msg){
    if(msg.isDebugRoom || msg.content.startsWith($config.prefix) && $room.indexOf(msg.room) !== -1
     && $hash.indexOf(java.lang.String(msg.author.avatar.getBase64()).hashCode()) !== -1){
        let rp = $rp_constructor(msg)
        let $code = msg.content.slice($config.prefix.length)

        try{
            let $timeout
            const $result = eval(
                "void ($timeout = $nanoTime());\n"
                + $code
            )
            msg.reply($style.result(Math.max(0, $nanoTime() - $timeout - 5000) / 1000000000, $result))
        } catch(e) {
            msg.reply($style.error(e))
        }
    }
}

return { evaluator: api2_evaluator.bind($global) }
}