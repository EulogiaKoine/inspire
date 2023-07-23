# util
&nbsp;여러 유용한 클래스들을 모아놓은 패키지입니다. ES6에 있지만 RhinoJS에 없는 것들도 이곳에 추가됩니다.

- [Promise](#promise)

&nbsp;

&nbsp;

## Promise
&nbsp;taylorhakes님의 Promise 구현체를 RhinoJS에 맞게 수정·통합하고 경량화한 모듈입니다.

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