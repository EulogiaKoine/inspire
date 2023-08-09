# 🎇 koine.extension
RhinoJS 및 메신저봇의 내장 클래스 기능을 확장(보완)한다.

<br>

<h3 align="center"> × Contents × </h3>

- [Object](#object)
- [String](#string)
- [Date](#date)
- [Math](#math)
- [Array](#array)
- [FileStream](#filestream)

<br>
<br>

<font size="1rem">

&nbsp;&nbsp;**Thanks to_** 와!, Regret
</font>

---------------------------------
## Object

- [Object.values()](#objectvaluesobj)
- [Object.entries()](#objectentriesobj)
- [Object.deepCopy()](#objectdeepcopyobj)

<br>

### Object.values(obj)
&nbsp;객체의 enumerable 속성의 값들을 배열로 반환한다.

[MDN - Object.values()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/values)

<br>


### Object.entries(obj)
&nbsp;객체의 enumerable 속성의 [키, 값] 쌍 배열을 요소로 가지는 배열을 반환한다.

[MDN - Object.entries()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)

<br>


### Object.deepCopy(obj)
&nbsp;인자로 객체를 받아 그 객체의 깊은 복사본을 반환한다. 이는 속성을 가진 배열, 함수도 포함된다.


#### example
```javascript
const arr = [{ test: 0 }]

const copy = Object.deepCopy(arr)
copy[0].test === arr[0].test // false
```


<br><br><br>

------------------------------
## String
- [String.prototype.format()](#stringprototypeformat)
- [String.prototype.countSplitLeft()](#stringprototypecountsplitleftn)
- [String.prototype.countSplitRight()](#stringprototypecountsplitrightn)
- [String.prototype.similars()](#stringprototypesimilarstarget)

<br>

### String.prototype.format()
&nbsp;문자열 형식화를 지원한다. 인자에 따라 다르게 작동한다.


#### 1. (첫 번째 인자가)객체일 경우
&nbsp;인자로 준 객체의 key에 해당하는 '{key}' 형태의 문자열을 해당 속성의 value로 바꾼다. 중복될 수 있다.

##### example_
```javascript
"{v1} + {v1} = {result}".format({
    v1: "spicy", v2: "veryvery spicy"
})
// 결과: "spicy + spicy = veryvery spicy"
```

#### 2. 그 외
&nbsp;'{index}' 형태의 문자열을 index번 인자로 바꾼다. 중복될 수 있으며, index는 0부터 시작한다.

##### example_
```javascript
let a = 1, b = 2
"{0} + {1} = {2}".format(a, b, a+b)
// "1 + 2 = 3"
```

<br>

### String.prototype.countSplitLeft(n)
&nbsp;문자열을 **왼쪽**에서부터 n개씩 자른 배열을 반환한다.

##### example_
```javascript
"123456789".countSplitLeft(2)
// ['12','34','56','78','9']
```

<br>

### String.prototype.countSplitRight(n)
&nbsp;문자열을 **오른쪽**에서부터 n개씩 자른 배열을 반환한다.

##### example_
```javascript
"123456789".countSplitRight(2)
// ['1','23','45','67','89']
```

<br>

### String.prototype.similars(target)
&nbsp;대상과의 유사도를 0~1사이의 값으로 반환한다. 한글일 경우 각 글자의 자모를 분해하여 판단한다.

&nbsp;시간복잡도가 더 긴 문자열의 길이 n에 대해 ***O(n²)*** 임을 유의하자.

##### example_
```javascript
"코이네".similars("쾨네") // 0.5  <- 유사도 = 50%

// 위 코드는 아래와 동일
"ㅋㅗㅇㅣㄴㅔ".similars("ㅋㅚㄴㅔ")
```

[*참고: 사용 알고리즘*](https://en.wikipedia.org/wiki/Levenshtein_distance)

<br><br><br>

--------------------------
## Date

- [Date.prototype.format()](#dateprototypeformat)
- [Date.fromFormat()](#datefromformat)

<br>

### Date.prototype.format()
&nbsp;Date 객체를 **원하는 형식의 문자열**로 치환한다.

```javascript
/**
 * @param {string?} pattern 날짜 정보를 반영할 문자열 형식
 * @returns {string} 날짜 정보를 형식에 반영한 문자열
 */
```

#### example_
```javascript
new Date().format("y. MM. d. E요일")
// 결과: "2023. 06. 7. 수요일"
```

#### 치환 형식

![치환 형식 표](https://d33wubrfki0l68.cloudfront.net/77f1bd2b1cf55940f68402dd309ecc25221acbd6/6819a/static/1c200ea964ab45a912ccc15b4999bc2a/07a9c/simpledateformat-date-time-patterns.png)

##### 유의점
&nbsp;1. 요일을 나타내는 E는 로컬에 맞춰진다. 즉, 카톡봇에선 Tue가 아니라 '화'로 표시됨

&nbsp;2. 형식 문자열을 여러 자 넣음으로써 글자 개수도 지정할 수 있다.(ex. y=2023, yy=23)

<br>

### Date.fromFormat()
&nbsp;문자열에서 날짜 정보를 추출해 Date객체로 만든다. 이때 문자열의 날짜 형식은 **직접 지정할 수 있다.**
```javascript
/**
 * @param {string} str 날짜 정보를 담은 문자열
 * @param {string?} pattern str의 형식을 명시하는 문자열
 * @returns {Date} pattern을 이용해 str로부터 추출한 정보로 생성한 Date 객체
 */
```

#### example
```javascript
Date.fromFormat("2023. 06. 7", "y. MM. d").toString()
// 결과: "Wed Jun 07 2023 00:00:00 GMT+0900 (GMT+09:00)"
```

&nbsp;기본 형식은 Date.prototype.format과 동일하다. 하지만 이유는 모르겠지만 요일 parse는 언어 무관 안된다.


<br><br><br>

----------------------------------------------
## Math

- [Math.gcd()](#mathgcdnumbers)
- [Math.lcm()](#mathlcmnumbers)
- [Math.clamp()](#mathclampvalue-min-max)
- [Math.lerp()](#mathlerpa-b-t)
- [Math.randint()](#mathrandinta-b)
- [package - combination](#combination)

<br>

### Math.gcd(...numbers)
&nbsp;인자들의 최대공약수를 반환한다.

#### example
```javascript
Math.gcd(18, 24) // 6
Math.gcd(1.5, -3) // 1.5   -> 음수와 실수도 가능하지만, 음수는 매우 지양합니다!
Math.gcd(391, 2231, 1633) // 23
```

<br>


### Math.lcm(...numbers)
&nbsp;인자들의 최소공배수를 반환한다.

#### example
```javascript
Math.lcm(18, 24) // 72
Math.lcm(1.5, -3) // -3
Math.lcm(391, 2231, 1633) // 2692817
```

<br>


### Math.clamp(value, min, max)
&nbsp;어떤 값이 범위 안에 있는지 검사하고 범위 내에 있으면 그 값을 바로 반환.

```javascript
/**
 * @param {number} value 그 어떤 값
 * @param {number} min 하한
 * @param {number} max 상한
 * @returns {number} 범위 내에 있으면 value를, 없으면 상/하한을 반환
 */
```
#### example
```javascript
Math.clamp(2, 1, 3) // 2
Math.clamp(0, 1, 3) // 1
Math.clamp(4, 1, 3) // 3
```

<br>

### Math.lerp(a, b, t)
&nbsp;a, b를 t 비율로 선형 보간

&nbsp;간단히 말해서 1차원 좌표 a, b의 간격을 t 비율로 나눈 점의 좌표를 반환. t가 1보다 큰 경우 b를 초과할 수 있다.

#### example
```javascript
Math.lerp(5, 10, 0.5) // 7.5
Math.lerp(100, 200, 0.13) // 113
```

<br>

### Math.randint(a, b)
&nbsp;b가 없다면 0부터 a까지, 있다면 a~b 까지의 임의의 정수를 반환한다.

##### example
```javascript
Math.randint(0, 10) // 10
Math.randint(4) // 3
```

&nbsp;

&nbsp;

### combination
&nbsp;Math extension의 하위 패키지입니다. 조합론에 관련된 몇몇 함수를 다룹니다.

&nbsp;extension.Math을 inspire하실 경우 기본적으로 함께 적용되므로, 메모리가 아까우시다면 귀찮음을 감수하고 쓸 것들만 inspire해주셔야 합니다...!

&nbsp;

#### Math.C(n, r)
&nbsp;조합의 경우의 수 함수입니다. ***nCr***과 동일하며, n과 r은 정수만 허용됩니다.

&nbsp;캐싱을 이용해 속도는 최초를 제외하면 O(1)입니다.

#### Math.P(n, r)
&nbsp;순열의 경우의 수 함수입니다. ***nPr***과 동일하며, n과 r은 정수만 허용됩니다.

#### Math.fact(n)
&nbsp;계승, 즉 ***n!*** 과 동일합니다. n은 정수만 허용됩니다.

#### Math.gamma(x)
&nbsp;감마 함수입니다. 자세한 설명은 [___여기___](https://ko.wikipedia.org/wiki/%EA%B0%90%EB%A7%88_%ED%95%A8%EC%88%98)를 참고해주세요.

#### Math.Cf(n, r)
&nbsp;n과 r로 **실수(Real Number)를 허용**하는 **조합 함수**입니다. 부동소수점 환경에 겹쳐 근사치를 구하기 때문에 소수점 10자리 이하에서 오차가 발생할 수 있습니다.

#### Math.Pf(n, r)
&nbsp;Cf와 같은 조건이 적용되는 **순열 함수**입니다.

#### Math.factf(n)
&nbsp;Cf와 같은 조건이 적용되는 **계승 함수**입니다.

<br><br><br>

-----------------------------------
## Array
- [Array.range()](#arrayrangestart-end-step)
- [ES6 standards](#es6-standard-prototypes)
- [Array.prototype.random()](#arrayprototyperandomstart-end)
- [Array.prototype.randomPop()](#arrayprototyperandompopstart-end)
- [Array.prototype.shake()](#arrayprototypeshakestart-end)
- [Array.prototype.toShaken()](#arrayprototypetoshakenstart-end)
- [Array.prototype.count()](#arrayprototypecountvalue)
- [Array.prototype.counts()](#arrayprototypecountsvalues)


<br><br>

### Array.range(start, end, step)
[Python - range() 함수](https://docs.python.org/ko/3/tutorial/controlflow.html#the-range-function)

#### example
```javascript
Array.range(5) // [0, 1, 2, 3, 4]
Array.range(3, 6) // [3, 4, 5]
Array.range(0, 1, 0.2) // [0, 0.2, 0.4, 0.6000000000000001, 0.8]

let sum = 0
for(let i of Array.range(1, 6))
    sum += +i
console.log(sum) // 15
```
<br>

### *ES6 standard prototypes
&nbsp;ES6 JS에 있지만 RhinoJS에는 없는 몇몇 메서드 구현체. 사용법, 작동 방식은 모두 동일합니다.

- [Array.prototype.at](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/at)
- [Array.prototype.findLast](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/findlast)
- [Array.prototype.findLastIndex](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findLastIndex)
- [Array.prototype.toReversed](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/toreversed)
- [Array.prototype.toSorted](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/tosorted)
- [Array.prototype.with](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/with)

<br>

### Array.prototype.random(start, end)
&nbsp;범위 내 임의의 원소를 반환.

```javascript
/**
 * @param {number} [start=0]
 * @param {number} [end=this.length]
 * @returns {*} random element between range [start, end]
 */
```
#### example_
```javascript
const arr = ["koine", "regret", "와!"]
arr.random() // "와!"
arr.ranodm() // "koine"

const test = []
for(let i in Array.range(1e5))
    test.push(arr.random(1, 2))
test.every(e => e === "regret") // true
```
<br>

### Array.prototype.randomPop(start, end)

**random()** 과 동일하지만 반환되는 요소를 **원본에서 제거**한다.



<br><br>


### Array.prototype.shake(start, end)
&nbsp;범위 내 모든 원소들의 위치를 임의로 섞는다. 원본이 변한다.
```javascript
/**
 * @param {number} [start=0]
 * @param {number} [end=this.length]   
 * @returns {Array} 원본
 */
```

#### example_
```javascript
let arr = [0,1,2,3,4]
arr.shake()
arr; // [4,0,3,1,2]

[0,1,2,3,4,5,6,7,8,9].shake(5) // 인덱스 5부터 끝까지
// [0,1,2,3,4/*여기까진 섞이지 않음*/, 6,7,9,8,5]
```
<br>

### Array.prototype.toShaken(start, end)
shake와 동일하지만, 원본을 바꾸지 않고 얕은 복사본을 반환한다.

<br>

### Array.prototype.count(value)
&nbsp;배열에 포함된 value와 **일치(===)** 하는 요소의 개수를 반환한다.

<br>

### Array.prototype.counts(values[])
```javascript
/**
 * @param {Array|undefined} [values = every[]] 기본값 = 배열의 모든 요소
 * @returns {Map}
 */
```
&nbsp;주어진 값들이 각각 몇 개씩 배열에 포함되어 있는지를 ***값: 개수*** 의**맵(Map)** 객체로 반환한다.

&nbsp;한 번의 순회에서 모든 값을 검사하기에 시간복잡도는 ***O(n)***. 개수를 검사해야할 값이 여럿이라면 똑같이 선형 탐색으로 ***O(n)*** 만큼이 걸리는 **count**보다 효율적이다.

&nbsp;*참고: Map을 모르는 사람들을 위해.
```javascript
let counts = [1,2,3,4,5,1,2,3,1].counts([1,3,5])
counts.get(1) // 3
counts.get(3) // 2
counts.get(5) // 1
counts.get('1') // 0
```

&nbsp;

### Array.prototype.repeat(n)
&nbsp;현재 배열의 요소를 n번 반복한 배열을 반환한다. 요소는 얕은 복사로 처리된다.

##### example_
```javascript
[1,2,3].repeat(3)
// 결과: [1,2,3,1,2,3,1,2,3]
```

&nbsp;

&nbsp;

&nbsp;

---

## FileStream
&nbsp;간단한데 구현해서 쓰기 귀찮았던 것들

- [exists()](#existspath)
- [isDirectory()](#isdirectorypath)
- [readObject()](#readobjectpath)
- [writeObject()](#writeobjectpath-data)

&nbsp;

### exists(path)
&nbsp;path 경로의 파일/폴더가 존재하는지 여부를 반환한다.
```javascript
FileStream.exists('/storage/emulated/0/test')
```

&nbsp;

### isDirectory(path)
&nbsp;path 경로에 일치하는 디렉토리의 존재 여부를 반환한다. false일 경우 파일이 존재하지 않을 수도 있다.
```javascript
FileStream.isDirectory(path)
```

&nbsp;

### readObject(path)
&nbsp;JSON 문자열로 구성된 파일을 객체로 읽어온다.
```javascript
/** @returns {!string} */
FileStream.readObject('path')
```

&nbsp;

### writeObject(path, data)
&nbsp;data를 JSON 문자열로 변환해서 경로에 저장한다.
```javascript
FileStream.writeObject('path', {a:1})
```