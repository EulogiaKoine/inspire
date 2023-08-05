"use strict"
module.exports = function(path, r_inspire, _global){
r_inspire("ThreadManager")

const Files = java.nio.file.Files
const Paths = java.nio.file.Paths
const SAVE_THREAD = 'SAVE_THREAD'

if(ThreadManager.exists(SAVE_THREAD))
    throw new Error("File - thread '" + SAVE_THREAD + "' is being used in another way!")

ThreadManager.create(SAVE_THREAD)
ThreadManager.start(SAVE_THREAD)


function File(path, isJson){
    if(this instanceof File){
        if(path){
            path = Paths.get(path)
            if(Files.isDirectory(path))
                throw new Error("File - "+String(path)+" is a directory!")
            Object.defineProperty(this, '_path', { value: path })
        } else {
            throw new TypeError("File need a path!")
        }
        if(isJson) this.isJson = true
        this.data = null
        this.sc = new java.util.concurrent.atomic.AtomicInteger()
    } else return new File(path, isJson)
}

File.SAVE_THREAD = SAVE_THREAD

Object.defineProperty(File.prototype, 'path', {
    get(){ return String(this._path) }
})

Object.defineProperty(File.prototype, 'toString', {
    value(){ return 'File:'+this.path+'' }
})

Object.defineProperty(File.prototype, 'read', {
    value(){ return this.data }
})

Object.defineProperty(File.prototype, 'write', {
    value(data){
        return this.data = this.isJson? data: String(data)
    }
})

Object.defineProperty(File.prototype, 'exists', {
    get(){ return Files.exists(this._path) }
})

Object.defineProperty(File.prototype, 'create', {
    value(){
        if(Files.notExists(this._path)){
            Files.createDirectories(this._path.getParent())
            Files.createFile(this._path)
        }
    }
})

Object.defineProperty(File.prototype, 'delete', {
    value(){ return Files.deleteIfExists(this._path) }
})

Object.defineProperty(File.prototype, 'save', {
    value(){
        if(this.sc.getAndIncrement() === 0) this.isSaving = true 
        const temp = this.isJson? JSON.stringify(this.data): this.data
        this.cache = this.isJson? temp: this.data // 스토리지 저장 전 메모리 캐싱(빠른 load 용)
        ThreadManager.run(SAVE_THREAD, () => {
            if(this.sc.decrementAndGet() === 0){
                this.create()
                Files.write(this._path, java.lang.String(temp).getBytes())
                this.isSaving = false
            }
        })
    }
})

Object.defineProperty(File.prototype, 'load', {
    value(readOnly){
        let data
        if(this.isSaving) data = this.isJson? JSON.parse(this.cache): this.cache
        else {
            if(this.exists){
                data = String(java.lang.String(Files.readAllBytes(this._path)))
                if(this.isJson) data = JSON.parse(data)
            } else {
                const e = new Error("File.load - there's no file '"+this.path+"' in the internal storage")
                e.name = "NoSuchFileError"
                throw e
            }
        }
        if(!readOnly) this.data = data
        return data
    }
})

if(!('File' in _global)) _global.File = File 

return { File: File }
}