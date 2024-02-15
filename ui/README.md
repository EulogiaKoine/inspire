# 📲 ui package
&nbsp;카톡봇의 사용자 인터페이스(UI)를 편리하게 설계, 보완하기 위한 패키지입니다.

&nbsp;**메신저봇R** 기준으로 제작되었습니다.

- [SessionManager](#sessionmanager)
- [class Chat](#chat)

&nbsp;

&nbsp;

&nbsp;

***Thanks to_*** Regret, DarkTornado, archetic, DEViolet, 옾챝봇, 무너


---------------------------
## <font color="#50EBEC">SessionManager</font>
&nbsp;채팅 알림의 **답장**/**읽음** 기능을 원하는 Key와 함께 직접 등록하고 사용할 수 있도록 지원합니다.

&nbsp;카톡에서의 사용만을 염두에 둔 점 유의 부탁드립니다.

&nbsp;<font color="gray"><sup>*(알림 리스너의 매개변수 sessionManager과는 무관합니다)*</sup></font>

&nbsp;

#### <font color="orange">제작 의도</font>

&nbsp;Companion이나 기존의 sessionManager를 <sup>(1)</sup>직접 사용 시 앱 자체에서 등록하는 세션과 꼬이는 문제, <sup>(2)</sup>이를 해결하기 위해 ***방 이름*** 대신 ***방ID***를 Key로 사용하려 했으나 내부 충돌 문제로 막히는 문제가 발생하여 이를 해결하기 위해 제작하였습니다.

&nbsp;

### <font color="orange">Interfaces</font>

- [send()](#sessionmanagersend)
- [read()](#sessionmanagerread)
- [setSend/ReadSession()](#sessionmanagersetsendsession--setreadsession)
- [hasSend/ReadSession()](#sessionmanagerhassendsession--hasreadsession)
- [getSend/ReadSession()](#sessionmanagergetsendsession--getreadsession)
- [getSessionsFromSBN()](#sessionmanagergetsessionsfromsbn)
- [setSessionBySBN()](#sessionmanagersetsessionbysbn)
- [getSendKeys()](#sessionmanagergetsendkeys)
- [getReadKeys()](#sessionmanagergetreadkeys)
- [getAllSendSessions()](#sessionmanagergetallsendsessions)
- [getAllReadSessions()](#sessionmanagergetallreadsessions)
- [getAllSessions()](#sessionmanagergetallsessions)
- [bringSessionsFromApp()](#sessionmanagerbringsessionsfromapp)
- [autoApplier()](#sessionmanagerautoapplier)
- [optimize()](#sessionmanageroptimize)


&nbsp;

&nbsp;

#### <font color="#ADF802"> SessionManager.send()</font>

##### info
```ts
@description
 해당 키의 세션을 이용해 메시지를 전송합니다.

@parameters
 key: string = 메시지를 보낼 세션 키
 msg: string = 보낼 메시지

@returns {boolean}
 전송 성공 여부
```

##### example
```js
const roomId = "01234567891011"
SessionManager.send(roomId, "테스트 메시지입니다.")
```

&nbsp;


#### <font color="#ADF802"> SessionManager.read()</font>

##### info
```ts
@description
 해당 키의 세션의 '읽음' 기능을 실행시킵니다.
 카톡 기준, 기존 Api의 markAsRead()와 동일합니다.

@parameters
 key: string = 읽을 세션 키

@returns {boolean}
 읽음 성공 여부
```

##### example
```js
const roomId = "01234567891011"
SessionManager.read(roomId)
```

&nbsp;



#### <font color="#ADF802"> SessionManager.setSendSession() / setReadSession()</font>

##### info
```ts
@description
 메시지 전송/읽기 세션을 등록합니다.
 문자열 키가 필요합니다.

@parameters
 key: string = 해당 세션의 키
 session: android.app.Notification$Action = 알림에서 가져온 세션
```

##### example
```ts
// API1 - Legacy
// 방ID를 키로 답장/읽기 세션을 등록하는 예제

// 해당 알림이 카톡 채팅인지 판단
function isKakaoChat(sbn: StatusBarNotification){
    return sbn.getPackageName() === "com.kakao.talk"
        && sbn.getTag() !== null
}

// 폰 상단 알림이 떴을 때 실행되는 함수
function onNotificationPosted(sbn: StatusBarNotification){
    if(isKakaoChat(sbn)){
        const roomId = sbn.getTag()
        const sessions = SessionManager.getSessionsFromSBN(sbn) // 다른 메서드 설명 참고

        // 답장 세션 등록
        SessionManager.setSendSession(roomId, sessions.send)

        // 읽기 세션 등록
        SessionManager.setReadSession(roomId, sessions.read)
    }
}
```

&nbsp;


#### <font color="#ADF802"> SessionManager.hasSendSession() / hasReadSession()</font>

##### info
```ts
@description
 해당 키의 세션이 존재하는지를 확인합니다.

@parameters
 key: string = 세션 키

@returns {boolean}
 세션 존재 여부
```

##### example
```js
const roomId = "01234567891011"
SessionManager.hasSendSession(roomId) // true or falase
SessionManager.hasReadSession(roomID) // true or false
```

&nbsp;



#### <font color="#ADF802"> SessionManager.getSendSession() / getReadSession()</font>

##### info
```ts
@description
 해당 키의 세션을 불러옵니다.

@parameters
 key: string = 세션 키

@returns {object {
    remoteInputs: List<android.app.RemoteInput> | null // read 세션 -> null
    actionIntent: android.app.PendingIntent
}}
 세션 복사본.
```

##### example
```js
const roomId = "01234567891011"
SessionManager.getSendSession(roomId)
SessionManager.getReadSession(roomId)
```

&nbsp;



#### <font color="#ADF802"> SessionManager.getSessionsFromSBN()</font>

##### info
```ts
@description
 sbn으로부터 전송(답장)/읽음 세션(액션)을 가져옵니다.
 약간의 편의성을 위함.
 가져올 수 없는 종류의 알림이면 null을 반환합니다.

@parameters
 sbn: StatusBarNotification = 알림 정보 객체

@returns {object {
    send: android.app.Notification$Action = 전송 세션
    read: android.app.Notification$Action = 읽기 세션
} | null}
```

##### example
```js
// setSendSession() setReadSession() 예제 참고
```

&nbsp;


#### <font color="#ADF802"> SessionManager.setSessionBySBN()</font>

##### info
```ts
@description
 전송/읽기 세션을 한 번에 등록합니다.

@parameters
 key: string = 세션 키
 sbn: StatusBarNotification = 알림 객체

@returns {boolean}
 등록 성공 여부.
 false인 경우:
   - 해당 알림 객체에 전송 또는 읽기 기능이 포함된 세션이 존재하지 않을 경우
```

##### example
```js
// API1 - Legacy

// 알림 이벤트 리스너
function onNotificationPosted(sbn){
    if(sbn.getTag())
        SessionManager.setSessionBySBN(
            sbn.getTag(), // 방ID
            sbn
        )
}
```

&nbsp;


#### <font color="#ADF802"> SessionManager.getSendKeys() </font>
##### info
```ts
@description
 모든 전송 키를 가져옵니다.

@returns {Array<string>}
 키 배열
```

&nbsp;



#### <font color="#ADF802"> SessionManager.getReadKeys() </font>
##### info
```ts
@description
 모든 읽기 키를 가져옵니다.

@returns {Array<string>}
 키 배열
```

&nbsp;



#### <font color="#ADF802"> SessionManager.getAllSendSessions()</font>

##### info
```ts
@description
 모든 전송(답장) 세션을 가져옵니다.

@returns {Array [object {
    key: string = 세션 키
    session: { remoteInputs, actionIntent } = 세션 복사본
}]}
```

&nbsp;


#### <font color="#ADF802"> SessionManager.getAllReadSessions()</font>

##### info
```ts
@description
 모든 읽기 세션을 가져옵니다.

@returns {Array [object {
    key: string = 세션 키
    session: { actionIntent } = 세션 복사본
}]}
```

&nbsp;



#### <font color="#ADF802"> SessionManager.getAllSessions()</font>

##### info
```ts
@description
 모든 세션을 가져옵니다.

@returns {Array [object {
    key: string = 세션 키
    // 두 세션 중 하나만 존재하면 나머지 하나는 null
    send: { remoteInputs, actionIntent }|null = 전송 세션 복사본
    read: { actionIntent }|null = 읽기 세션 복사본
}]}
```

&nbsp;



#### <font color="#ADF802"> SessionManager.bringSessionsFromApp()</font>

##### info
```ts
@description
 메신저봇 앱에 저장된 유효한 세션을 모두 가져옵니다.(종종 남아 있는 만료된 세션들 제외)

@parameter
 package: string? = 패키지명. 기본값=카카오톡(com.kakao.talk)

@returns {Array [object {
    key: string = 세션 키
    // 둘 중 하나만 있을 경우 나머지는 null
    send: android.app.Notification$Action|null = 전송 세션 복사본
    read: android.app.Notification$Action|null = 읽기 세션 복사본
}]}
```

&nbsp;



#### <font color="#ADF802"> SessionManager.autoApplier()</font>

##### info
```ts
@description
 자동으로 알림을 분석, 세션을 등록해주는 알림 리스너 함수를 반환합니다.
 안정성을 위해 현재는 카카오톡만 지원합니다.

@parameter
 ...type: SessionManager.KeyType = 자동 등록될 세션의 키 종류입니다.
                                     여러 타입을 넣을 수 있습니다.

@returns {function(sbn)}
 알림 리스너 함수
```

##### example
```js
// API1 - Legacy

const KeyType = SessionManager.KeyType

// 알림 이벤트 리스너
const onNotificationPosted = SessionManager.autoApplier(
    KeyType.ROOM_ID, // 방ID
    KeyType.ROOM_NAME, // 방 이름
    KeyType.SENDER_NAME, // 보낸사람 이름
    KeyType.PROFILE_HASH // 프로필 해시코드
)
```

##### * ***Notice***
<font size="2px">

1. 키 타입은 하나 이상이어야 합니다.
2. 예제처럼 여러 타입을 설정할 경우, 알림이 왔을 때 해당 알림의 전송/읽기 세션을 해당하는 모든 타입의 키에 대해 등록합니다.

</font>

&nbsp;



#### <font color="#ADF802"> SessionManager.optimize()</font>

##### info
```ts
@description
 전송 알고리즘 최적화 여부 설정.
 메시지 전송 기능을 외부 스레드로 분리, 처리 효율을 크게 향상시킵니다.
 생성된 스레드는 컴파일 시 사라지며, 기본값은 false입니다.

@parameter
 on: boolean = 최적화 여부. 미입력 시 기본값은 true(최적화 적용)

@return {boolean}
 false일 경우: 이미 켜져(꺼져) 있는데 키려(끄려) 했을 때
```

##### example
```js
// 최적화 전 메서드
const send_before = SessionManager.send

SessionManager.optimize(true)

// 최적화 후에는 메서드 자체가 교체되니, 이 점 반드시 유의해주세요
SessionManager.send === send_before // false
```

&nbsp;

&nbsp;

&nbsp;

&nbsp;








---------------------------
## <font color="#00FF7F">Chat</font>
&nbsp;알림 정보(특히 카카오톡 채팅)를 해석하여 속성으로 접근할 수 있도록 하는 클래스입니다. ***안드로이드 버전 및 API 환경에 구애받지 않고 동일하게 작동***하도록 제작되었습니다.

#### <font color="lightblue"><i>2024-02-15 update</i></font>
&nbsp;기존 환경의 불안정성을 이유로 같은 패키지의 SessionManager에 답장(reply) 기능을 의존하게 되었습니다. 따라서 SessionManager에 답장 세션을 추가해야 Chat에서도 동작합니다.<sup><font color="lightgray"><i><del>(LSP 위반이지만 inspire은 저랑 가까운 지인만 쓰는 것 같아서.)</del></i></font></sup>

&nbsp;***respond()*** 가 API2에도 추가됐습니다. 또한, 이제는 ***inspire()*** 시 자동으로 전역에 추가되지 않습니다.

&nbsp;



&nbsp;***Chat*** 객체는 기본적으로 아래의 속성을 지닙니다.
```typescript
packageName: string = 알림을 받은 패키지명
isKakaoChat: boolean = 알림이 '카카오톡'의 '채팅'인지 여부
```

&nbsp;추가로, ***isKakaoChat == true***일 경우 아래의 속성을 보장합니다. ***false***일 때 호출 시 <font color="red"><b>오류</b></font>가 발생할 수 있습니다.
```typescript
room: string = 방 이름

msg: string = 받은 메시지 내용

sender: string = 보낸사람 이름

isGroupChat: boolean = 단체채팅 여부

profileHash: number = 프로필 사진의 비트맵 해시코드
 >> 방에 상관없이 동일하지만, 봇이 작동되는 기기에 따라 다르다.

roomId: string = 채팅이 온 방의 고유한 ID
 >> 방마다 다르지만, 봇이 작동되는 기기에 상관없이 동일하다

isMention: boolean = 멘션 여부

isMultiChat: boolean = 복제 카카오톡 여부(채자봇의 그거)

imageDB: ImageDB = 보낸사람의 프로필 사진 데이터; 레거시 response의 인자로 들어오는 imageDB와 동일
 >> imageDB.getProfileHash()로 profileHash와 동일한 값을 얻을 수 있지만, 최초 호출을 제외하면 profileHash 사용이 더 빠르다.
```

&nbsp;제공하는 메서드는 아래의 2가지입니다. ***isKakaoChat == false***일 경우 <font color="red"><b>사용할 수 없습니다.</b></font>
```typescript
reply(msg: string): void
 >> 채팅이 온 방에 msg라는 채팅을 보냅니다.

markAsRead(): boolean
 >> 채팅이 온 방의 채팅을 읽고, 성공 여부를 반환합니다.
```

&nbsp;

### 사용법

&nbsp;반드시 ***new*** 키워드와 함께 호출해야 합니다. 인자로는 ***StatusBarNotification*** 객체를 넣어주시면 됩니다.

&nbsp;자세한 것은 아래의 예시들을 참고해주세요

&nbsp;

#### Legacy(API 1)
&nbsp;***onNotificationPosted*** 리스너 함수의 1번째 인자로 들어오는 sbn을 인자로 넣어 Chat 객체를 생성합니다. 이때, 생성된 객체의 ***isKakaoChat*** 속성으로 응답을 제한시켜주는 게 좋습니다.

```javascript
function onNotificationPosted(sbn, sm){
    const chat = new Chat(sbn)
    if(chat.isKakaoChat){
        // 실행될 코드
    }
}
```

&nbsp;자바스크립트가 익숙하지 않은 분들을 위한 ***respond()*** 정적 메서드를 지원합니다. 대신 약간 느립니다(소규모 봇은 무시해도 될 정도).
```javascript
function responseFix(room, msg, sender, isGroupChat, replier, imageDB, packageName, isMultiChat, isMention, roomId){
    // 카톡 채팅이 올 시 작동하는 부분

    // 인자는 Chat의 속성과 동일합니다.
    // profileHash는 들어오지 않습니다.
}

function onNotificationPosted(sbn, sm){
    Chat.respond(sbn, responseFix)
}
```

&nbsp;

### API2
&nbsp;***Event.NOTIFICATION_POSTED*** 이벤트 리스너의 1번째 인자로 들어오는 sbn을 인자로 넣어 Chat 객체를 생성합니다.
```javascript
bot.addListener(Event.NOTIFICATION_POSTED, function(sbn, sm){
    const chat = new Chat(sbn)
    if(chat.isKakaoChat){
        // 실행될 코드
    }
})
```

&nbsp;카카오톡 메시지에 반응하는 함수 예제는 아래와 같이 간단히 짤 수 있습니다.
```javascript
function onMessage(chat){
    // 카톡 메시지가 오면 실행될 부분
}

bot.addListener(Event.NOTIFICATION_POSTED, function(sbn, sm){
    const chat = new Chat(sbn)
    if(chat.isKakaoChat) onMessage(chat)
})
```