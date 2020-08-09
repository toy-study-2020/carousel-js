class carousel {
    constructor(selector, options) {
        this.selector = selector,
        this.options = options
    }
    set() {
        const ele = document.querySelector(this.selector);
        const opts = this.options;
        const childEle = {
            wrapper: ele.querySelector('.wrapper'),
            list: ele.querySelector('.list'),
            slide: ele.querySelectorAll('.slide'),
            arrowsButton: ele.querySelectorAll('.arrows-button button'),
            playButton: ele.querySelector('.play-button'),
            length: ele.querySelectorAll('.slide').length,
        }

        clonedChild(childEle);
        // childEle.cloneLength = (ele.querySelectorAll('.slide').length - childEle.length) / 2;
        // console.log(childEle.cloneLength)
        
        calcDefaultSize(childEle);

        const current = {
            index: opts.initialindex,
            slide: childEle.slide[opts.initialindex],
            interval: null,
        }
        current.slide.classList.add('carousel-active');
    
        for(let i = 0; i < childEle.arrowsButton.length; i++) {
            childEle.arrowsButton[i].addEventListener('click', (event) => {
                clickArrow(event, childEle, opts, current);
                autoplayPause(current);
                setTimeout(() => {
                    autoplayStart(childEle, opts, current);
                }, opts.timer);
            });
        }
        childEle.playButton.addEventListener('click', (event) => {
            if(event.target.classList.contains('fa-pause-circle')) {
                event.target.classList.remove('fa-pause-circle');
                event.target.classList.add('fa-play-circle');
                autoplayPause(current);
            } else {
                event.target.classList.remove('fa-play-circle');
                event.target.classList.add('fa-pause-circle');
                autoplayStart(childEle, opts, current);
            }
        })

        if(opts.autoplay) autoplayStart(childEle, opts, current);
    }
}

const clonedChild = (childEle) => {
    const firstChild = childEle.list.firstElementChild.cloneNode(true);
    const lastChild = childEle.list.lastElementChild.cloneNode(true);
    childEle.list.appendChild(firstChild);
    childEle.list.insertBefore(lastChild, childEle.list.firstElementChild);
}

const calcDefaultSize = (childEle) => {
    const defaultSize = {
        width: () => {
            let size = 0;
            childEle.slide.forEach(slide => {
                size = size < slide.offsetWidth ? slide.offsetWidth : size
            })
            return size;
        },
        height: () => {
            let size = 0;
            childEle.slide.forEach(slide => {
                size = size < slide.clientHeight ? slide.clientHeight : size
            });
            return size;
        }
    }
    
    childEle.list.style.width =  `${defaultSize.width() * (childEle.length + 2)}px`;
    childEle.list.style.transform = `translate3d(-${defaultSize.width()}px, 0px, 0px)`;
    childEle.wrapper.style.width = `${defaultSize.width()}px`;
    childEle.wrapper.style.height = `${defaultSize.height()}px`;
}

const clickArrow = (e, childEle, opts, current) => {
    const target = e.target;
    if(target.classList.contains('next')) moveNext(childEle, opts, current);
    if(target.classList.contains('prev')) movePrev(childEle, opts, current);
}

const moveNext = (childEle, opts, now) => {
    if(now.index <= childEle.length - 1) {
        childEle.list.style.transition = `${opts.speed}ms`;
        childEle.list.style.transform = `translate3d(-${childEle.wrapper.offsetWidth * (now.index + 2)}px, 0px, 0px)`;
    }
    if(now.index === childEle.length - 1) {
        setTimeout(() => {
            childEle.list.style.transition = `0ms`;
            childEle.list.style.transform = `translate3d(-${childEle.wrapper.offsetWidth}px, 0px, 0px)`;
        }, opts.speed);
        now.index = -1;
    }

    now.slide.classList.remove('carousel-active');
    now.slide = childEle.slide[++now.index];
    now.slide.classList.add('carousel-active');
}

const movePrev = (childEle, opts, now) => {
    if(now.index >= 0) {
        childEle.list.style.transition = `${opts.speed}ms`;
        childEle.list.style.transform = `translate3d(-${childEle.wrapper.offsetWidth * now.index}px, 0px, 0px)`;
    }
    if(now.index === 0) {
        setTimeout(() => {
            childEle.list.style.transition = `0ms`;
            childEle.list.style.transform = `translate3d(-${childEle.wrapper.offsetWidth * childEle.length}px, 0px, 0px)`;
        }, opts.speed);
        now.index = childEle.length;
    }
    
    now.slide.classList.remove('carousel-active');
    now.slide = childEle.slide[--now.index];
    now.slide.classList.add('carousel-active');
}

const autoplayStart = (childEle, opts, current) => {
    const moveFunc = opts.rtl ? movePrev : moveNext;
    current.interval = setInterval(() => {
        moveFunc(childEle, opts, current);
    }, opts.timer);
}

const autoplayPause = (current) => {
    clearInterval(current.interval);
}


const carouselTest = new carousel('#carousel', {
    initialindex: 0,
    speed: 500,
    autoplay: true,
    // rtl: true,
    timer: 2000,
})
window.onload = () => {
    carouselTest.set();
}
