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

- 삼항연산자에 함수를 사용해도 되는거죠? 
```
this.setObj.direction ? this.clickNext() : this.clickPrev();
```
- 정말 별기능이 없는 함수라도 재사용을 생각해서 함수를 쪼개는것이 좋은지에 대한 의문

# 어려운것들

