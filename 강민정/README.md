# Carousel-js
### 기본값 
```javascript
let defaultOption = {
  mode: 'horizontal',
  elWrapper: 'ul',
  el: 'li',
  slideView: 1,
  control: 1,
  indicator: 1,
  loop: 1,
  autoplay: 1,
  endEvent: () => {}
}
```

### 생성방법
```javascript
const carousel = new Carousel({
  wrapper: '.makeCarousel',
  endEvent: () => {
    console.log('move');
  }
});
```
혹은
```javascript
const singleCarousel = new Carousel('.singleCarousel');
```
