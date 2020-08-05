// carousel
// clone item을 만드는 것과 그에 따른 index 값 변화를 파악하는 것이 요점일듯!

const carousel = (options) => {
    const container = document.querySelector(options.selector);
    const wrapper = container.children[0];
    const item = container.querySelectorAll('.item');
    const itemLength = item.length;
    const arrow = container.querySelectorAll('.arrow');
    const initialindex = options.initialindex;
    const space = options.space;
    const speed = options.speed;

    // 처음, 끝 item 복제
    let firstChild = wrapper.firstElementChild;
    let lastChild = wrapper.lastElementChild;
    let clonedFirst = firstChild.cloneNode(true);
    let clonedLast = lastChild.cloneNode(true);
    wrapper.appendChild(clonedFirst);
    wrapper.insertBefore(clonedLast, wrapper.firstElementChild);
    
    // current index, slide setting
    let currentIdx = initialindex;
    let currentSlide = item[currentIdx];
    currentSlide.classList.add('carousel-active');

    // item size 계산
    const calcsize = itemSize(item, space);
    const moveSize = calcsize.width + calcsize.space;
    setDefaultSize(container, wrapper, item, initialindex, calcsize);
    
    // arrow 방향 결정
    const clickArrow = (e) => {
        const target = e.target;
        const direction = target.classList.contains('next');
        
        if(direction) moveNext();
        else movePrev();
    }
    for(let i = 0; i < arrow.length; i++) {
        arrow[i].addEventListener('click', clickArrow);
    }

    // next, 오른쪽으로
    const moveNext = () => {
        console.log('next', currentIdx);
        if(currentIdx <= itemLength - 1) {
            wrapper.style.transition = `${speed}ms`;
            wrapper.style.transform = `translate3d(-${moveSize * (currentIdx + 2)}px, 0px, 0px)`;
        }
        if(currentIdx === itemLength - 1) {
            setTimeout(() => {
                wrapper.style.transition = `0ms`;
                wrapper.style.transform = `translate3d(-${moveSize}px, 0px, 0px)`;
            }, speed);
            currentIdx = -1;
        }
        
        currentSlide.classList.remove('carousel-active');
        currentSlide = item[++currentIdx];
        currentSlide.classList.add('carousel-active');
    }

    // prev, 왼쪽으로
    const movePrev = () => {
        console.log('prev', currentIdx);
        if(currentIdx >= 0) {
            wrapper.style.transition = `${speed}ms`;
            wrapper.style.transform = `translate3d(-${moveSize * currentIdx}px, 0px, 0px)`;
        }
        if(currentIdx === 0) {
            setTimeout(() => {
                wrapper.style.transition = `0ms`;
                wrapper.style.transform = `translate3d(-${moveSize * itemLength}px, 0px, 0px)`;
            }, speed);
            currentIdx = itemLength;
        }
        
        currentSlide.classList.remove('carousel-active');
        currentSlide = item[--currentIdx];
        currentSlide.classList.add('carousel-active');
    }
}

const itemSize = (item, space) => {
    const width = () => {
        let size = 0;
        item.forEach(element => {
            size = size < element.offsetWidth ? element.offsetWidth : size
        });
        return size;
    }
    const height = () => {
        let size = 0;
        item.forEach(element => {
            size = size < element.clientHeight ? element.clientHeight : size
        });
        return size;
    }
    const sizeObject = {
        space: space,
        width: width(),
        height: height()
    }
    return sizeObject;
}

const setDefaultSize = (container, wrapper, item, initIdx, size) => {
    // item
    item.forEach(element => {
        element.style.margin = `0 ${size.space}px`;
    });
    // wrapper
    const wrapWidth = (size.width + size.space) * item.length * 2;
    const transWidth = (size.width + size.space) * (initIdx + 1) * -1;
    wrapper.style.width =  `${wrapWidth}px`;
    wrapper.style.transform = `translate3d(${transWidth}px, 0px, 0px)`;
    
    // cotainer
    container.style.width = `${size.width + size.space}px`;
    container.style.height = `${size.height}px`;
}



window.onload = () => {
    const slide = carousel({
        selector: '#carousel',
        speed: 500,
        space: 0,
        initialindex: 0,
    });
}
