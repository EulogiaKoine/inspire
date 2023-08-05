"use strict"
module.exports = (function(){

/** @author koine */

const CHO = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'
const JUNG = 'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ'
const JONG = ' ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ'

/**
 * @param {string} str
 * @returns {string} 한글 글자의 자모를 모두 분해시킨 문자열 
 */
function norm(str){
    const l = str.length
    const res = str.split('')
    let c
    for(let i = 0; i < l; i++){
        if(/[가-힣]/.test(res[i])){
            c = res[i].normalize('NFD')
            res[i] = ''
            for(let j = 0; j < c.length; j++){
                if(j === 0){
                    res[i] += CHO[c[j].charCodeAt() - 4352]
                } else if(j === 1){
                    res[i] += JUNG[c[j].charCodeAt() - 4449]
                } else {
                    res[i] += JONG[c[j].charCodeAt() - 4519]
                }
            }
        }
    }
    return res.join('')
}

/**
 * @param {string} s1 
 * @param {string} s2 
 * @returns {number} 0~1 사이의 값(유사도)
 * @description 편집 거리 알고리즘(레벤슈타인)을 이용, 두 문자열 간 유사도를 측정하여 반환
 */
function getSimilarity(s1, s2){
    if(s1 === s2) return 1
    if(s2.length > s1.length) return getSimilarity(s2, s1)
    if(s2.length === 0) return 0
    const d = Array(s2.length+1).fill().map((_, i) => i? [i]: Array(s1.length+1).fill().map((_, j) => j))
    for(let i = 1; i <= s2.length; i++)
        for(let j = 1; j <= s1.length; j++)
            d[i][j] = Math.min(d[i][j-1]+1, d[i-1][j]+1, d[i-1][j-1]+(s2[i-1] != [s1[j-1]]))
    return 1 - d[s2.length][s1.length]/s1.length
}

/** @this {string} */
function similars(target){
    if(typeof target === 'string')
        return getSimilarity(norm(this), norm(target))
    throw new TypeError("String.prototype.similars - target must be a string!")
}


if(!String.prototype.similars) Object.defineProperty(String.prototype, 'similars', {
    value: similars,
    writable: true
})

return {
    norm: norm,
    getSimilarity: getSimilarity
}
})()