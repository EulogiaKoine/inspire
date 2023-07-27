# util
&nbsp;여러 유용한 클래스들을 모아놓은 패키지입니다. ES6에 있지만 RhinoJS에 없는 것들도 이곳에 추가됩니다.

- [Promise](#promise)
- [ThreadManager](#threadmanager)
- [File](#file)

&nbsp;

&nbsp;

------------------------
## Promise
&nbsp;taylorhakes님의 Promise 구현체를 RhinoJS에 맞게 수정·통합하고 경량화한 모듈입니다.

&nbsp;***inspire()*** 시 전역에 Promise 생성자가 추가됩니다.

#### [copyright](https://github.com/taylorhakes/promise-polyfill)
#### [Promise란?](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise)

##### example
```javascript
const log = []
new Promise((res, rej) => {
  setTimeout(() => {
    log.push("Promise 테스트")
    res("resolved successfully")
  }, 3000)
}).then(result => log.push(result))

// 3초 후
log // ["Promise 테스트", "resolved successfully"]
```

&nbsp;

&nbsp;

&nbsp;


-----------------------
## ThreadManager
&nbsp;엄밀히 말하면, **트랜잭션 처리 큐**입니다.

&nbsp;**함수**를 **작업**으로 받아 순차, 동기적으로 처리하는 스레드를 편하게 관리할 수 있도록 도와줍니다.

&nbsp;***inspire()*** 시 전역에 **ThreadManager** 객체가 추가됩니다.

&nbsp;
#### Methods_

- [create()](#createname-string)
- [start()](#startname-string)
- [stop()](#stopname-string)
- [isAlive()](#isalivename-string)
- [run()](#runname-string-task-function)
- [sync()](#syncname-string-fn-function)
- [clearTask()](#cleartaskname-string)
- [remove()](#removename-string)
- [stopAll()](#stopall)
- [list()](#list)

&nbsp;

### create(name: string)
&nbsp;name 이라는 이름의 스레드를 생성합니다.
```javascript
ThreadManager.create('thread_name')
```

&nbsp;

### start(name: string)
&nbsp;name 스레드를 시작합니다.
```javascript
ThreadManager.start('thread_name')
```

&nbsp;

### stop(name: string)
&nbsp;name 스레드를 정지합니다. 처리 중이던 작업은 끝까지 처리되고, 처리되지 않은 작업은 큐에 그대로 남습니다.
```javascript
ThreadManager.stop('thread_name')
```

&nbsp;

### isAlive(name: string)
&nbsp;name 스레드가 동작 중인지 여부를 반환합니다.
```javascript
ThreadManager.isAlive('thread_name')
```

&nbsp;

### run(name: string, task: function)
&nbsp;name 스레드에서 task를 실행시킵니다. 인자와 this 지정은 불가능하니 유의해주세요.
```javascript
const work = {
  task(arg){
    ...
  }
}

ThreadManager.run(
  'thread_name',
  () => work.task('arg')
)
```

&nbsp;

### sync(name: string, fn: function)
&nbsp;**함수 fn이 name 스레드에서 실행되도록 하는 함수를 생성**합니다. 이를 이용하면 기존 함수/메서드를 그대로 대체할 수 있습니다.

```javascript
const work = {
  task: ThreadManager.sync('thread_name', function(arg){
    ...
  }
}

work.task('arg')
// 'thread_name' 스레드에서 this=work 상태로 살행됨
```
&nbsp;name이라는 이름의 스레드가 존재하지 않을 때 사용 시 **오류**를 발생시킵니다.

&nbsp;

### clearTask(name: string)
&nbsp;name 스레드의 작업 큐를 비웁니다.
```javascript
ThreadManager.clearTask('thread_name')
```

&nbsp;

### remove(name: string)
&nbsp;name 스레드를 영구적으로 제거합니다. 작업도 함께 소멸합니다.
```javascript
ThreadManager.remove('thread_name')
```

&nbsp;

### stopAll()
&nbsp;생성(create)된 모든 스레드를 정지시킵니다. 작업은 큐에 그대로 남습니다.
```javascript
ThreadManager.stopAll()
```
&nbsp;미리 아래와 같이 설정해두면 봇이 컴파일되더라도 스레드가 계속 돌아가는 것을 막을 수 있습니다.
#### 레거시
```javascript
function onStartCompile(){
  ThreadManager.stopAll()
}
```
#### API2
```javascript
BotManager.getCurrentBot().addListener(
  Event.START_COMPILE,
  function(){
    ThreadManager.stopAll()
  }
)
```

&nbsp;

### exists(name)
&nbsp;name 스레드가 존재하는지 확인한다.
```javascript
ThreadManager.exists('thread_name')
```

&nbsp;

### list()
&nbsp;생성(create)된 스레드의 이름을 배열로 반환합니다.
```javascript
ThreadManager.create('thread_name')
ThreadManager.list() // ["thread_name"]
```

&nbsp;

&nbsp;

&nbsp;

--------------
## File
&nbsp;카톡봇에서 내부 저장소의 파일 관리를 **효율적이고 편리**하게 하기 위한 클래스입니다.

&nbsp;**inspire** 시 전역에 **File 클래스**가 추가됩니다.

&nbsp;***ThreadManager***을 참조합니다. 사용하는 스레드는 ***File.SAVE_THREAD*** 속성으로 확인하실 수 있습니다.

&nbsp;

### new File(path: string, isJson: boolean)
&nbsp;**path(type: string)** 경로에 대한 파일을 생성합니다. 실제 파일 존재 여부와는 관계없이 생성됩니다.

&nbsp;**isJson=true**일 경우 내부 저장소에 객체에 저장된 내용을 저장하거나, 저장소로부터 파일 내용을 불러올 때 자동으로 JSON 변환을 수행합니다.

##### example
```javascript
// 일반 파일 객체 생성
const txt_file = new File('file_path')

// JSON 파일 객체 생성
const json_file = new File('file_path.json')
```

&nbsp;

#### Methods_

- [get path](#get-path)
- [get exists](#get-exists)
- [create(), delete()](#create-delete)
- [read(), write()](#read-writecontent)
- [load(), save()](#loadreadonly-save)


&nbsp;

&nbsp;

### get path
&nbsp;파일의 경로를 문자열로 반환합니다. getter 속성입니다.
```javascript
new File("test").path // 'test'
```

### get exists
&nbsp;내부 저장소에서 파일의 존재 여부를 반환합니다. getter 속성입니다.
```javascript
new File('test').exists // false
```

&nbsp;

### create(), delete()
&nbsp;***create()*** 는 **exists=false**일 시 저장소에 파일을 생성합니다. 내용은 비어있습니다.

&nbsp;***delete()*** 는 저장소에서 파일 삭제를 시도하고, 성공 여부를 반환합니다. 즉, 이미 존재하지 않을 시 **false**를, 존재할 시 삭제하고 **true**를 반환합니다.
```javascript
const txt_file = new File('test')
txt_file.exists   // false
txt_file.delete() // false
txt_file.create()
txt_file.exists   // true
txt_file.delete() // true
txt_file.exists   // false
```

&nbsp;

### read(), write(content)
&nbsp;메모리에 기록된 해당 객체의 정보를 읽어오거나, 덮어씁니다. 내부 저장소의 내용에는 관여하지 않습니다.
```javascript
const txt_file = new File('file_path')
txt_file.read() // null - 최초에는 null
txt_file.write("ㅇㅅㅇ")
txt_file.read() // "ㅇㅅㅇ"
txt_file.write(1) // 문자열이 아닌 값도 쓸 순 있습니다. 문자열로 바뀔 뿐.
txt_file.read() // "1"

const json_file = new File('file_path.json', true)
json_file.read() // 마찬가지
json_file.write(1)
json_file.read() // 1  <- 자료형 유지
json_file.write({a:1})
json_file.read().a = 2
json_file.read() // {a:2}  <- 참조 유지
```

&nbsp;

### load(readOnly), save()
&nbsp;***load()*** 는 내부 저장소에서 파일 내용을 불러와 File객체에 저장하고 그 값을 반환합니다. JSON 파일일 경우 JSON.parse()를 수행합니다. ***readOnly=true***일 경우 불러와서 반환만 하고 File객체에 저장하진 않습니다.(기본값=false)

&nbsp;파일이 존재하지 않을 때 ***load()*** 시 오류가 발생합니다.
```javascript
const txt_file = new File('/sdcard/test.txt')
txt_file.exists // true  <- 존재하는 파일로 실험
txt_file.read() // null
txt_file.load(true /* readOnly */) // "ㅇㅅㅇ!"  <- 저장돼있던 내용
txt_file.read() // null  <- readOnly=true 였기 때문에
txt_file.load(/* readOnly = false(기본값) */)
txt_file.read() // "ㅇㅅㅇ!"

const json_file = new File('/sdcard/test.json', true)
json_file.exists // true
json_file.load() // {a:1}
json_file.read().a = 2
json_file.read() // {a:2}
json_file.load(true /* readOnly */) // {a:1}
json_file.read() // {a:2}
```

&nbsp;

&nbsp;***save()*** 는 현재 File 객체에 저장된 내용을 <u><b>비동기적이고</b></u>, <u><b>최소한으로</b></u> 내부 저장소에 저장합니다. 즉, 기존 FileStream.write()와 달리 ***save()*** 를 호출한 측에서는 <u><b>시간이 거의 소요되지 않습니다</b></u>. 또한, 여러 저장 요청이 밀려 있을 경우 항상 가장 마지막 요청만 처리하기 때문에 <u><b>실제 저장 시간을 최소한으로 보장</b></u>합니다.

&nbsp;저장 도중에 ***load()*** 시 마지막 저장 내용을 불러오기 때문에 경합 문제로부터도 안전합니다.

&nbsp;쉽게 말하자면, ***그냥 많이 빠르고 안전한 파일 저장***입니다.

&nbsp;저장소에 파일이 존재하지 않을 시 생성하고 저장합니다.

```javascript
const json_file = new File('test.json', true)
const obj = {a:1}

json_file.exists // false
json_file.write(obj)
json_file.save()
json_file.write(null)
json_file.read() // null
json_file.load()
json_file.read() // {a:1}

// 문자열화를 한 번 거쳤기 때문에 원본과는 참조가 다름
json_file.read() === obj // false
```

&nbsp;

#### +덤: 성능테스트
&nbsp;**실험:** 두 가지 형식의 파일 저장 시간 측정

&nbsp;**수행 횟수:** 100,000회
|사용 모듈|Text 파일|JSON 파일|
|:---|:---:|:---:|
|**FileStream**|40 sec.|63 sec.|
|**File**|10 sec.|15 sec.|

&nbsp;평균적으로 약 4배 이상. 덤으로 여러 스레드에서 접근할 시의 안전도 보장.