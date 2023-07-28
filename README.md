# inspire()

&nbsp;파이썬의 **import** 를 모방한 카카오톡봇 용 패키지 관리 모듈(함수). 기본 경로 설정 문제로 현재는 [**메신저봇R**](https://play.google.com/store/apps/details?id=com.xfl.msgbot) 에서만 작동한다.

&nbsp;

<h3 align="center"> × Contents × </h3>

- [How to Use: 사용법](#❓how-to-use)
- [How to Deveop: 모듈/패키지 개발하기](#❓how-to-develop)

&nbsp;

&nbsp;

<sub><a href="https://open.kakao.com/o/sa1mmcLb">*문의사항은 여기로</a></sub>

----------------------
### ❓How to Use
&nbsp;

#### 1. 적용
&nbsp;해당 모듈을 불러오면 함수를 반환한다. 봇의 메인 소스에서 해당 함수에 인자로 전역 객체를 넣으면 자동으로 전역에 ***inspire()*** 함수가 추가된다.

```javascript
require('inspire')(this /* [object global] */)
```



&nbsp;

#### 2. 모듈/패키지 설치 경로
&nbsp;기본 경로는 메신저봇 기본 경로의 ***library*** 폴더. ***inspire*** 적용 시 자동으로 생성된다. 본 문서의 규약을 지키는 모듈/패키지를 해당 경로에 추가하여 설치할 수 있다.

&nbsp; 모듈/패키지 구성은 아래와 같다.
```javascript
library
 └ moduleName.js
 └ packageName
   └ moduleName.js
 └ packageName
   └ moduleName.js
   └ __init__.js
```

&nbsp;패키지 폴더에 ***\_\_init__.js*** 는 **패키지 자체를 불러올 때** 사용하는 용도이다. 하위 모듈을 직접 불러온다면 없어도 무방하다. 이에 대한 자세한 설명은 [***How to Develop***](#❓how-to-develop) 로.

&nbsp;깃허브에 만들어 둔 기본 패키지/모듈들도 있으니 참고.

&nbsp;

#### 3. 사용 - 모듈/패키지 불러오기

```javascript
inspire("moduleName")
inspire("packageName")
const module = inspire("packageName.moduleName")
```

&nbsp;모든 모듈/패키지는 **객체**를 반환한다.

&nbsp;반환값과 별개로 **(전역에) 새로운 함수를 추가**하거나, **기존 기능을 대체**할 수도 있다. 반환값을 이용해야만 하는 모듈도 있을 수 있다.

&nbsp;이처럼 불러올 시 적용되는 점은 각 모듈의 설명을 참고.

&nbsp;

### 4. inspire_init
&nbsp;2023. 7. 28 업데이트된 기능. 기준 경로(library)와 함수명(inspire)을 지정하여 '추가'할 수 있다. 즉, **여러 inspire 함수가 다른 이름과 다른 기준 경로를 가지고 존재할 수 있다.**
```javascript
/**
 * @name inspire_init
 * @param {object} globalObject 전역 객체
 * @param {string=} [libPath="메신저봇 폴더/library"] 기준 경로
 * @param {string=} [fname="inspire"] 추가되는 함수명
 */
const inspire_init = require('inspire')
```

&nbsp;자신만의 프로젝트를 따로 떼어놓고 싶은 사람들을 위해 추가한 기능.

#### 기존
```javascript
// 이걸로 끝남.
require('inspire')(this /* [object global] */)
```

#### 이후
```javascript
// 기존과 동일한 사용 가능
require('inspire')(this /* [object global] */)
inspire // function inspire(request: string){...}

// 원하는 경로로 추가 사용
const PROJECT_PATH = '/sdcard/project'
require('inspire')(
    this, // [object global]
    PROJECT_PATH, // 기본값=메신저봇 library 폴더
    'projecter' // 
)
projecter // function projecter(request: string){...}
```
&nbsp;헷갈리는 부분은 문의.



&nbsp;

&nbsp;

----------------------
### ❓How to Develop
&nbsp;먼저 **inspire**구조에 대해 간단히 알아보자.

&nbsp;**첫째.** 한번 **inspire**된 모듈, 패키지는 모두 캐싱된다. 이는 모든 모듈, 패키지에서 동일하게 적용된다. 즉, 모듈 간 의존성이 단방향이 된다.

&nbsp;**둘째.** 패키지(폴더) 자체를 **inspire**할 경우 해당 폴더 내의 ***\_\_init__.js***를 **모듈**처럼 호출한다. 즉, 패키지 내의 모듈을 묶어서 내보내는 역할은 ***\_\_init__.js***가 맡는다.

&nbsp;**셋째.** 어떤 패키지에 속하더라도 모듈은 개별적으로 불러올 수도 있다. 즉, <u>**독립적으로도 기능할 수 있어야 한다.**</u> 반강제로 모듈화의 원칙을 지킬 수밖에 없다.

&nbsp;

&nbsp;위를 유의하며, 아래의 간단한 구체적인 규약 하나만 지키면 모듈/패키지가 완성된다. library에 넣어서 쓰자.

&nbsp;

#### ✓ 반환값
&nbsp;**모듈 파일**, 또는 패키지 폴더 내의 ***\_\_init__.js*** 파일은 <u>**객체**</u> 또는 <u>**객체를 반환하는 함수**</u>를 반환해야 한다.

&nbsp;

##### 1. 객체를 반환하는 경우
&nbsp;반환값이 그대로 캐싱된다.

##### example_
```javascript
module.exports = {
    YEAH: "module!"
}
```


&nbsp;

##### 2. 함수를 반환하는 경우
&nbsp;아래의 세 인자를 순서대로 넣어 실행하고, 그 실행값을 캐싱한다.

1. 부모 디렉토리의 절대 경로
2. 현재 경로에서 사용 가능한 inspire
3. 전역 객체

&nbsp;이때의 함수는 반드시 **객체**를 반환해야 한다.

&nbsp;

##### example_
```javascript
module.exports = funtion(parentPath, r_inspire, globalObject){
    // r_inspire은 대충 relative inspire 약자; 이름 상관 없음
    const config = FileStream.read(parentPath + '/config.txt')
    const tool = r_inspire('sub_module.js')

    function module(){
        // something wonderful
    }

    globalObject.thisModule = module.bind(tool)

    // 객체 반환
    return {
        config: config,
        module: module.bind(tool)
    }
}
```