# Carousel

- [x] HTML/CSS

- [x] 처음에는 한개의 아이템이 노출

- [x] 좌/우 버튼이 눌리면 좌우 아이템이 노출

- [x] 아이템이 이동시 슬라이딩 되는 느낌으로 진행

- [x] 좌우 루프가 되어야 합니다.

- [x] Pagination 제공

- [x] Pagination 버튼 클릭시 이동 기능

# 구현해야하는것

- [ ] 자동재생(정지/시작)

- [ ] 재생 타이머 변경 옵션

- [ ] 이동 속도(transition speed) 변경 옵션

- [ ] 재생 타이머 제한(재생 타이머의 값은 이동 속도보다 빠를 수 없다.)

# 고민되는것들
- 인자값은 어떻게 써주는게 좋을까요? 
  타입형태로 쓰는게 좋은지 함수안에서 사용하는 변수명으로 사용하는게 좋은지?
```
function(position, idx){
  let position = position;
}
```

- if문을 연쇄해서 사용하고싶지 않은데 방법이 있을까요?
```
if (e.target.className === 'btn_preview' && this.currentCount >= 0) {
  this.currentPosi += this.frameWidth;
  this.currentCount--;
}

if (e.target.className === 'btn_next' && this.currentCount < this.slideLength) {
  this.currentPosi -= this.frameWidth;
  this.currentCount++;
}
```

- 정말 별기능이 없는 함수라도 재사용을 생각해서 함수를 쪼개는것이 좋은지에 대한 의문

- 좌우버튼 하나의 이벤트함수를 걸어서 안에서 e.target.className으로 기능을 나누었는데 
이렇게 사용해도 되나요??? 
아니면 버튼 좌, 우 버튼 이벤트를 따로 만드는게 나은것인지? 

# 어려운것들

- 좌우 버튼 클릭이벤트 프로토타입 clickBtnEvt에 너무많은 조건들을 나열해 놓은것같아서 리펙토링하고싶은데 넘 어려워요...

* 조건 1. 이전버튼 클릭, 맨처음에있는 클론한 인덱스가 아닐때 
- 조건 2. 다음버튼 클릭, 맨마지막에있는 클론한 인덱스가 아닐때
- 조건 3. 맨처음에있는 클론한 인덱스일때
- 조건 4. 맨마지막에있는 클론한 인덱스일때

- autoplay기능도 조건1, 2 이전다음버튼만 변경해서 clickBtnEvt에를 사용하려고 하는데 괜찮을까요? 
