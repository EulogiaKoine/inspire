# evaluate
&nbsp;카톡봇에서 유용한 디버깅 및 테스트를 위해 고급화된 함수를 제공합니다.

&nbsp;구체적으로는 아래의 기능들을 제공합니다.

1. 나노(10⁻⁹)초 단위 시간 측정과 최대한의 정밀도
2. 에러 추적
3. 변경 가능한 옵션 제공
    1. 매개변수 타입(레거시/API2)
    2. 접두사
    3. 허용할 방들
    4. 허용할 사람의 해시코드들

&nbsp;

&nbsp;또한 들어가기에 앞서, 이 글을 읽는 분들이 카톡봇에서 **프로필 해시코드**가 어떤 것이고, 어떻게 얻는지는 모두 아신다고 전제하겠습니다.

&nbsp;



## Introduction

1. [적용하기](#적용하기)
    1. [Legacy(API1)](#레거시api1)
    2. [API2](#api2)
2. [옵션 변경]()



&nbsp;

&nbsp;

### 적용하기
&nbsp;각각의 모듈로도 사용은 가능하지만, 정리 및 통합된 패키지 자체를 불러와서 사용하기를 권장드립니다.

```javascript
inspire('evaluate')
// 전역에 evaluate 추가
```

&nbsp;

#### 리스너
&nbsp;아시다시피, 카톡봇의 메시지 리스너(response/onMessage)는 메시지의 정보를 각기 다른 형태의 매개변수로 받습니다. 디버깅 코드를 해당 리스너 안에 작성할 경우 리스너의 매개변수를 사용하게 됩니다.

```javascript
function response(room, msg, ... , replier){
    eval(msg)
}

response("ㅇㅅㅇ", "replier.reply(room)", ... , { reply(){ ... }})
```

&nbsp;본 모듈은 디버깅 코드에서 참조하는 매개변수의 타입을 설정할 수 있습니다. 타입은 아래와 같이 정의되어 있습니다.

```typescript
enum evaluate.ParameterType {
    Symbol LEGACY
    Symbol API2
}
```

&nbsp;매개변수 타입을 지정하여 디버깅 코드를 실행할 리스너를 얻을 수 있습니다.
```javascript
evaluate.getListener(evaluate.ParameterType.LEGACY)
```

&nbsp;이렇게 얻어낸 리스너를 사용하는 방법은 환경 별로 따로 설명하겠습니다.

&nbsp;


#### 레거시(API1)
&nbsp;***evaluate.getListener()*** 로 원하는 매개변수 타입의 디버깅 리스너를 불러왔다면, 해당 리스너를 response 안에서 매개변수를 그대로 전달해주시면 됩니다.

```javascript
const eval_listener = evaluate.getListener(evaluate.ParameterType.LEGACY)

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName){
    eval_listener(room, msg, sender, isGroupChat, replier, imageDB, packageName)
}
```

&nbsp;끝입니다.

&nbsp;


#### API2
&nbsp;세 가지 방법이 있으니 취향껏 사용하시면 됩니다.

&nbsp;우선 리스너를 얻어옵니다.
```javascript
const eval_listener = evaluate.getListener(evaluate.ParameterType.LEGACY)
```

&nbsp;첫째, 봇 리스너에 그대로 넣습니다.
```javascript
bot.addListener(Event.MESSAGE, eval_listener)
```

&nbsp;둘째, 다른 리스너 중간에 끼워넣습니다.
```javascript
function onMessage(msg){
    ...
    eval_listener(msg)
}
```

&nbsp;셋째, ***on() / off()*** 메서드를 이용합니다. 이 경우 미리 리스너를 가져올 필요가 없이 인자로 바로 매개변수 타입을 넣어주시면 됩니다.
```javascript
// 리스너 등록
evaluate.on(evaluate.ParameterType.LEGACY)

// 제거
evaluate.off()
```
&nbsp;API2일 경우 리스너 중복을 막아주고 가독성이 올라가기 때문에 마지막 방법을 권장드립니다.

&nbsp;

&nbsp;

### 옵션 변경

#### 접두사
&nbsp;prefix 속성을 이용합니다. prefix를 null로 설정할 경우 이발이 작동하지 않습니다.
```javascript
evaluate.prefix = "!"
```

&nbsp;

#### 방
&nbsp;작동할 방을 제한합니다. room 배열 속성을 이용합니다. 참조가 유지되어야 하기 때문에 **반드시** 메서드를 이용해서 수정해야 합니다.

```javascript
evaluate.room.push("방1")
evaluate.room.push("방2")
```

&nbsp;

#### 해시코드
&nbsp;프로필 해시코드를 설정하여 사용자를 제한합니다. hash 배열 속성을 이용합니다. room과 마찬가지로 참조가 유지되어야 하기 때문에 **반드시** 메서드를 이용해서 수정해야 합니다.

```javascript
evaluate.hash(1234567890)
```