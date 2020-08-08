// carousel

const carousel = (options) => {
    const container = document.querySelector(options.selector);
    const wrapper = container.querySelector('.wrapper');
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
        console.log('next');
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
        console.log('prev');
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
    const setDirect = (rtl) => {
        let func;
        if(!rtl) func = moveNext;
        if(rtl) func = movePrev;
        return func
    }
    let direction = setDirect(options.rtl);
    let interval  = null;

    const startplay = () => {
        interval = setInterval(() => {
            direction();
        }, timer);
    }
    const pauseplay = () => {
        clearInterval(interval);
    }
    // init
    if(autoplay) {
        startplay();
    }

    // play pause button
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
    // list
    const listWidth = (size.width + size.space) * item.length * 2;
    const transWidth = (size.width + size.space) * (initIdx + 1) * -1;
    list.style.width =  `${listWidth}px`;
    list.style.transform = `translate3d(${transWidth}px, 0px, 0px)`;
    
    // wrapper
    wrapper.style.width = `${size.width + size.space}px`;
    wrapper.style.height = `${size.height}px`;
}



window.onload = () => {
    //   carousel 설정
    const slide = carousel({
        selector: '#carousel', // container id값
        speed: 500, // 
        space: 0, // item간 간격(구현x)
        initialindex: 0, // 시작 index값
        autoplay: true, // autoplay
        timer: 2000, // autoplay 시간
        // rtl: true, // 슬라이드 방향설정
    });
}
