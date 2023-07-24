# util
&nbsp;여러 유용한 클래스들을 모아놓은 패키지입니다. ES6에 있지만 RhinoJS에 없는 것들도 이곳에 추가됩니다.

- [Promise](#promise)
- [ThreadManager](#threadmanager)

&nbsp;

&nbsp;

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