# 📲 ui package
&nbsp;카톡봇의 사용자 인터페이스(UI)를 편리하게 설계, 보완하기 위한 패키지입니다.

&nbsp;**메신저봇R** 기준으로 제작되었습니다.

- [class Chat](#chat)

&nbsp;

&nbsp;

&nbsp;

***Thanks to_*** Regret, DarkTornado, archetic, DEViolet, 옾챝봇

---------------------------
## Chat
&nbsp;알림을 해석하는 클래스입니다. ***안드로이드 버전 및 API 환경에 구애받지 않고 동일하게 작동***하도록 제작되었습니다.

&nbsp;

&nbsp;***Chat*** 객체는 기본적으로 아래의 속성을 지닙니다.
```javascript
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

userId: string = 보낸 사람의 고유한 사용자 ID
 >> 채팅방마다 다르지만, 봇이 작동되는 기기에 상관없이 동일하다

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
&nbsp;***onNotificationPosted*** 리스너 함수의 1번째 인자로 들어오는 sbn을 인자로 넣어 Chat 객체를 생성합니다.

```javascript
function onNotificationPosted(sbn, sm){
    new Chat(sbn) // [object Chat]
}
```

&nbsp;단, 레거시의 경우(만) 자바스크립트가 익숙하지 않은 분들을 위한 ***respond()*** 정적 메서드를 지원합니다. 대신 약간 느립니다(초보는 무시해도 될 정도).
```javascript
function responseFix(room, msg, sender, isGroupChat, replier, imageDB, packageName, isMultiChat, isMention, userId){
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
    new Chat(sbn) // [object Chat]
})
```

&nbsp;카카오톡 메시지에 반응하는 함수 예제는 아래와 같이 간단히 짤 수 있습니다.
```javascript
function onMessage(chat){
    // 카톡 메시지가 오면 실행될 부분
}

bot.addListener(Event.NOTIFICATION_POSTED, function(sbn, sm){
    const chat = new Chat(sbn)
    if(chat.isKakaoTalk) onMessage(chat)
})
```