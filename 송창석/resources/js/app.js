// carousel

// clone item을 만드는 것과 그에 따른 item증가, index값 변화를 파악하는 것이 요점일듯!

const carousel = (options) => {
    const container = document.querySelector(options.selector);
    const wrapper = container.children[0];
    const list = container.querySelector('.list');
    const item = container.querySelectorAll('.item');
    const itemLength = item.length;
    const arrow = container.querySelectorAll('.arrow');
    const initialindex = options.initialindex;
    const space = options.space;
    const speed = options.speed;
    const playButton = container.querySelector('.play-button .play');
    const pauseButton = container.querySelector('.play-button .pause');

    // 처음, 끝 item 복제
    let firstChild = list.firstElementChild;
    let lastChild = list.lastElementChild;
    let clonedFirst = firstChild.cloneNode(true);
    let clonedLast = lastChild.cloneNode(true);
    list.appendChild(clonedFirst);
    list.insertBefore(clonedLast, list.firstElementChild);
    
    // current index, slide setting
    let currentIdx = initialindex;
    let currentSlide = item[currentIdx];
    currentSlide.classList.add('carousel-active');

    // item size 계산
    const calcsize = itemSize(item, space);
    const moveSize = calcsize.width + calcsize.space;
    setDefaultSize(wrapper, list, item, initialindex, calcsize);
    
    // arrow 방향 결정
    const clickArrow = (e) => {
        const target = e.target;
        if(target.classList.contains('next')) moveNext();
        else movePrev();
        
        // autoplay clear 및 restart
        autoplay = false;
        pauseplay();
        setTimeout(() => {
            autoplay = true;
            startplay();
        }, timer);
    }
    for(let i = 0; i < arrow.length; i++) {
        arrow[i].addEventListener('click', clickArrow);
    }

    // next, 오른쪽으로
    const moveNext = () => {
        // console.log('next', currentIdx);
        if(currentIdx <= itemLength - 1) {
            list.style.transition = `${speed}ms`;
            list.style.transform = `translate3d(-${moveSize * (currentIdx + 2)}px, 0px, 0px)`;
        }
        if(currentIdx === itemLength - 1) {
            setTimeout(() => {
                list.style.transition = `0ms`;
                list.style.transform = `translate3d(-${moveSize}px, 0px, 0px)`;
            }, speed);
            currentIdx = -1;
        }
        
        currentSlide.classList.remove('carousel-active');
        currentSlide = item[++currentIdx];
        currentSlide.classList.add('carousel-active');
    }

    // prev, 왼쪽으로
    const movePrev = () => {
        // console.log('prev', currentIdx);
        if(currentIdx >= 0) {
            list.style.transition = `${speed}ms`;
            list.style.transform = `translate3d(-${moveSize * currentIdx}px, 0px, 0px)`;
        }
        if(currentIdx === 0) {
            setTimeout(() => {
                list.style.transition = `0ms`;
                list.style.transform = `translate3d(-${moveSize * itemLength}px, 0px, 0px)`;
            }, speed);
            currentIdx = itemLength;
        }
        
        currentSlide.classList.remove('carousel-active');
        currentSlide = item[--currentIdx];
        currentSlide.classList.add('carousel-active');
    }

    // autoplay
    let autoplay = options.autoplay ? options.autoplay : false;
    const timer = options.timer ? options.timer : false;
    const setDirect = (direct) => {
        let func;
        if(direct === 'right') func = moveNext;
        if(direct === 'left') func = movePrev;
        return func
    }
    let direction = setDirect(options.direction);
    let interval  = null;

    const startplay = () => {
        interval = setInterval(() => {
            direction();
        }, timer);
    }
    const pauseplay = () => {
        clearInterval(interval);
    }
    if(autoplay) {
        startplay();
    }

    playButton.addEventListener('click', startplay);
    pauseButton.addEventListener('click', pauseplay);
}

// 기본크기계산
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

// 기본크기적용
const setDefaultSize = (wrapper, list, item, initIdx, size) => {
    // item
    item.forEach(element => {
        element.style.margin = `0 ${size.space}px`;
    });
    // wrapper
    const listWidth = (size.width + size.space) * item.length * 2;
    const transWidth = (size.width + size.space) * (initIdx + 1) * -1;
    list.style.width =  `${listWidth}px`;
    list.style.transform = `translate3d(${transWidth}px, 0px, 0px)`;
    
    // cotainer
    wrapper.style.width = `${size.width + size.space}px`;
    wrapper.style.height = `${size.height}px`;
}



window.onload = () => {
    const slide = carousel({
        selector: '#carousel',
        speed: 500,
        space: 0,
        initialindex: 0,
        autoplay: true,
        timer: 2000,
        direction: 'right',
    });
}
