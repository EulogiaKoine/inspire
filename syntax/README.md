# 📑 syntax

&nbsp;카카오톡 봇, RhinoJS 환경의 부족하거나 필자(코이네)가 필요한 문법적 부분을 함수로 보완한 패키지.

1. [inherits](#inherits)
2. [assert](#assert)

<br>

----------
## inherits

&nbsp;class 문법을 지원하지 않는 <sub><del>(더러운)</del></sub>RhinoJS에서 생성자 함수로 상속을 구현하기 위한 함수.

&nbsp;super 문법은 시도 끝에 실패했다.

&nbsp;

#### Inspired
&nbsp;전역에 ***inherits*** 함수가 추가된다.


#### Usage
```javascript
/**
 * @param {function} derived 자식(상속받을) 클래스
 * @param {function} super 부모(상속하는) 클래스
 * @returns {void}
 */
inherits(Derived, Super)
```


#### Example
```javascript
function Food(name){
    this.name = name
}

Object.defineProperty(Food.prototype, "eaten", {
    value(eater){
        return eater+"(이)가 "+this.name+"(을)를 섭취했다!"
    }
})

function Banana(){
    Food.call("바나나")
}

inherits(Banana, Food) // 상속

new Banana().eaten("코이네") // "코이네(이)가 바나나(을)를 섭취했다!"
```
<br>

## assert

&nbsp;단정문을 통한 오류 검사 및 추적<sup>Error Tracing</sup>을 원활히 할 수 있도록 만든 함수.

&nbsp;C++에서 유용해보였고, RhinoJS에서 자동 에러 트레이싱을 안 해주길래 가져왔다.

<sup>(*중급자 이하, 소규모 프로젝트 개발자에겐 사용을 권장하지 않습니다.)</sup>

&nbsp;

#### 단정문이란?
&nbsp;코드의 실행 환경에서 최소한 보장되어야 할 사항을 '단정(assertion)'하여 이외의 상황을 배제하는 것. 디버깅과 오류 추적, 유지 및 보수에 용이하다.

&nbsp;단정은 예외를 검사하는 과정이기도 해서, 때로 복잡한 연산을 필요로 하기도 한다. 따라서 본 ***assert*** 함수는 **3번째 인자**로 '중요도 레벨'을 받고, 함수의 속성으로 일정 중요도 이하의 단정문 실행을 무시하도록 설정하여 연산량을 줄일 수 있다.

&nbsp;

#### Inspired
&nbsp;전역에 ***assert*** 함수가 추가된다.

#### Usage
```javascript
/**
 * @param {boolean|function} assertion
 *  단정하는 정보.
 *  함수일 경우 실행값이, 아니라면 불린을 씌운 논리값이 거짓일 경우 오류를 발생시킨다.
 *
 * @param {string} msg 단정이 틀릴 경우 띄울 오류메시지
 * @param {number=} [level=Infinity] 중요도(후술)
 * 
 * @throws {Error} assert 자신을 제외한 콜 스택을 stack 속성에 포함한 에러 객체
 */
assert(assertion, msg, level=Infinity)


/**
 * @static {number >= 0} ignoranceLevel 무시할 중요도
 */
assert.ignoranceLevel = 0 // 기본값
```
<br>

#### Example 1. 일반적인 단정문
```javascript
// ------------- 일반 단정문 --------------
function c(v){
    assert(v > 3, "parameter must larget than 3!")
}

function b(v){
    c(v)
}

function a(v){
    b(v)
}

try{
    a(3)
} catch(e){
    console.log(e+'\n'+e.stack)
    /* RhinoJS 기준 결과(대충 줄이랑 같이 비슷하게 나옴)
    Error: parameter must larget than 3!
        at c
        at b
        at a
    */
}
```

&nbsp;

#### Example 2. 함수를 이용한 단정문과 중요도

```javascript
// 프로그램 내부

// 크기 n의 2차원 단위행렬을 2차월 배열 속성으로 가지는 함수
function UnitMatrix(n){
    this.data = new Array(n).fill().map((v, i) => {
        const raw = new Array(n).fill(0)
        raw[i] = 1
        return raw
    })
    this.size = n
    Object.definePropery(this, 'size', { writable: false })
}

UnitMatrix.prototype.at(raw, col){
    return this.data[raw-1][col-1]
}


// 모종의 UnitMatrix 활용 코드
const field = new UnitMatrix(5)

// O(n^2) 만큼의 메서드 호출, 반복 연산으로 속도 감소의 원인이 되는 단정문
// 그러나 UnitMatrix에서 보장하는 부분이기에 중요도는 낮음
assert(() => {
    const N = field.size+1
    // 모든 성분을 돌며 대각성분만 1인지 검사
    for(let i = 1; i < N; i++)
        for(let j = 1; j < N; j++)
            if(i === j && field.at(i, j) !== 1) || (i !== j && field.at(i, j) !== 0))
                return false
}, '기본 필드 생성에 문제가 있습니다!', 1 /* 중요도=1 */)


// 프로그램 내부 끝


// ...이후 프로그램이 완성되고 테스트도 끝난 후...

// 무시할 단정문 중요도
assert.ignoranceLevel = 2 // 2레벨 이하는 모두 무시

// 프로그램 실행(예시)
Program.execute() // 단정문 실행 X
```