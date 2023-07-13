"use strict"
module.exports = {
    /**
     * @param {number} t 실행에 소요된 시간; 단위: 초 / 1e-9까지 측정
     * @param {*} r 실행 결과 
     * @returns {string}
     */
    result(t, r){
        return "⏱˚ " + t + " sec.\n" + r
    },

    /**
     * @param {Error} e 실행 중 발생한 오류 객체
     * @returns {string}
     */
    error(e){
        if(e.stack) e.stack = e.stack.split('\n').slice(0, -2).join('\n')
        return "☢ " + e.name + " ··· " + Math.max(0, (e.lineNumber - 1))
            + "\n " + e.message + ((e.stack && e.stack.trim())? "\u200b".repeat(500) + "\n" + e.stack: '')
    }
}