# 📑 op
&nbsp;operator 패키지; 봇 작동, 또는 디버깅 등을 위한 패키지입니다.

- [power](#power)
- [DecodeFuncUnicode](#decodefuncunicode)


&nbsp;

## power
&nbsp;휴대폰의 앱은 일정 시간 이상 백그라운드 상태일 때 자동으로 sleep 상태로 전환됩니다. 이때는 배터리 소모 속도와 작동 속도가 함께 감소합니다.

&nbsp;본 패키지는 sleep 상태 전환을 조작하여 속도를 향상시킵니다.


#### power.boost()
&nbsp;sleep 상태 전환을 막습니다. 배터리 소모 속도가 상승하는 점 유의해주세요.
```javascript
power.boost()
```

#### power.rest()
&nbsp;sleep 상태 전환을 허용합니다. 기본값입니다.
```javascript
power.rest()
```

&nbsp;

&nbsp;

## DecodeFuncString
&nbsp;함수를 문자열화할 때 아스키코드와 유니코드를 문자열로 바꿔줍니다. **inspire()**시 자동으로 적용되며, 추가 설정은 필요없습니다.

#### example
```javascript
function test(){
    "ㅇㅅㅇ"
}

test.toString()
/* 결과
function test() {
    "\u3147\u3145\u3147";
}
*/

inspire('op.DecodeFuncString')

test.toString()
/* 결과
function test() {
    "ㅇㅅㅇ";
}
*/
```

&nbsp;

&nbsp;

## evaluate
[자세한 설명](./evaluate/README.md)