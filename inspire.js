const PACKAGE_INDEX = '__init__.js'

function inspire_init(_global, libPath, fnName){

if(!(typeof _global === 'object' && _global.toString() === "[object global]")){
    let error = new Error("inspire - please check the argument")
    error.name = "NotGlobalObjectError"
    throw error
}

const PATH = typeof libPath === 'string'?
    libPath:
    com.xfl.msgbot.utils.SharedVar.Companion.getBotsPath().split('/').slice(0, -1).join('/') + "/library"
const NAME = typeof fnName === 'string'? fnName: "inspire"
const cache = {}

if(NAME in _global)
    throw new Error("inspire_init - inspire function named '"+NAME+"' has been already initialized! please check the 3rd argument")

if(!java.io.File(PATH).exists())
    java.io.File(PATH).mkdirs()


function assert(c, m, n){
    if(!c){
        const e = new Error(m)
        if(typeof n === 'string') e.name = n
        throw e
    }
}


/**
 * @name analyzeRequest
 * @param {string} req 패키지명.모듈명 형태의 import 요청
 * @returns {{
 *     name: string,        // 이름
 *     path: string,        // 절대 경로
 *     isModule: (boolean|null)    // 모듈 여부
 * }}
 *
 * @description 요청사항을 바탕으로 해당 모듈/패키지에 대한 정보를 분석하여 객체로 반환한다.
 *  반환값의 isModule == null 이라면 조건에 맞는 모듈/패키지는 존재하지 않는다.
 * 
 * @condition
 *   모듈은 js 형식의 파일. 패키지는 확장자가 없는 폴더여야 한다.
 */
function analyzeRequest(req){
    req = req.split('.')
    let path = PATH + '/' + req.join('/')
    let file = java.io.File(path)
    let isModule = null

    if(file.exists() && file.isDirectory()){
        isModule = false
    } else {
        path += '.js'
        file = java.io.File(path)
        if(file.exists() && !file.isDirectory())
            isModule = true
    }

    return {
        name: req[req.length-1],
        path: path,
        isModule: isModule
    }
}


/**
 * @name inspire
 * @param {string} req 패키지명.모듈명 형태의 inspire 요청
 * @ensure
 *     요청에 해당하는 패키지/모듈이 있을 경우 전역에 설치 및 캐싱
 */
function inspire(req){
    if(typeof req !== 'string')
        throw new TypeError("inspire - request must be a string; format = 'packageName.moduleName' or 'packageName'")
    const info = analyzeRequest(req)
    assert(info.isModule !== null,
        "inspire - module " + req + " doesn't exist",
        "ModuleNotFoundError"
    )
    let path = info.path.split('/').slice(0, -1) // 부모 배열
    let c = cache // 현재 경로
    for(let pack of path){ // 재귀 탐색
        if(c[pack] === void 0)
            c[pack] = {}
        c = c[pack]
    }
    // case: module
    if(info.isModule){
        let module = c[info.name]
        if(module === void 0){
            module = require(info.path)
            if(typeof module === 'function'){
                req = req.split('.').slice(0, -1)
                module = module(
                    path.join('/'), // 부모 디렉토리 경로
                    r => inspire(req.concat(r).join('.')), // 상대 경로 요청
                    _global
                )
            }
            assert(typeof module === 'object',
                "inspire - module '" + info.name + "' must return object or function which returns object",
                "ModuleReturnTypeError"
            )
            c[info.name] = module
        }
        return module
    }
    // case: package
    let pack = c[info.name]
    let _continue_inspire = false
    if(typeof pack === "object"){
        if(!pack.__inspired__) _continue_inspire = true
    } else {
        pack = {}
        c[info.name] = pack
        _continue_inspire = true
    }
    if(_continue_inspire){
        if(java.io.File(info.path + '/' + PACKAGE_INDEX).exists()){
            let __init__ = require(info.path + '/' + PACKAGE_INDEX)
            if(typeof __init__ === 'function'){
                req = req.split('.')
                __init__ = __init__(
                    path.join('/'),
                    r => inspire(req.concat(r).join('.')),
                    _global
                )
            }
            assert(typeof __init__ === 'object',
                "inspire - package file " + info.name + '/' + PACKAGE_INDEX + " must return object or function which returns object",
                "PackageIndexReturnTypeError"
            )
            pack = Object.assign(__init__, pack)
            c[info.name] = pack
        }
        Object.defineProperty(pack, '__inspired__', {
            value: true
        })
    }
    return pack
}

inspire.toString = () => `function `+NAME+`(request: string /* "pack.module" */) {\n\t[native code, arity=1]\n}`

_global[NAME] = inspire
}

inspire_init.toString = () => `function inspire_init(object_global, libPath="msgbot/library", custom_name="inspire") {\n\t[native code, arity=3]\n}`
module.exports = inspire_init