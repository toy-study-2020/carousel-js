// carousel
const carousel = (obj) => {
    const container = document.querySelector(obj.selector);
    const wraper = container.children[0];
    const item = container.querySelectorAll('.item');
    const arrow = container.querySelectorAll('.arrow');
    
    const ele = {
        container: container,
        wrapper: wraper,
        item: item,
        arrow: arrow,
    }
    const idx = {
        start: obj.initialindex < ele.item.length ? obj.initialindex : false,
        now: obj.initialindex < ele.item.length ? obj.initialindex : false,
        end: ele.item.length - 1,
    }
    const size = itemSize(ele.item, obj.margin);
    setDefaultSize(ele, idx, size);
    
    // 방향 결정
    const clickArrow = (e) => {
        const target = e.target;
        const direction = target.classList.contains('next');
        
        if(direction) moveRight(ele, idx, size);
        else moveLeft(ele, idx, size);
    }
    for(let i = 0; i < arrow.length; i++) {
        arrow[i].addEventListener('click', clickArrow);
    }

    // next, 오른쪽으로
    const moveRight = (ele, idx, size) => {
        // console.log('right', ele, idx, size);
        idx.now = idx.now >= idx.end ? 0 : idx.now + 1;
        moveWrapper(ele, idx, size);
    }

    // prev, 왼쪽으로
    const moveLeft = (ele, idx, size) => {
        idx.now = idx.now <= 0 ? idx.end : idx.now - 1;
        moveWrapper(ele, idx, size);
    }
}

const itemSize = (item, margin) => {
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
        margin: margin,
        width: width(),
        height: height()
    }
    return sizeObject;
}

const setDefaultSize = (ele, idx, size) => {
    // item
    setItem(ele, idx, size);
    // wrapper
    setWrapper(ele, idx, size);
    // cotainer
    setContainer(ele, idx, size);
}

// item
const setItem = (ele, idx, size) => {
    ele.item[idx.start].classList.add('now');
    ele.item.forEach(element => {
        element.style.marginRight = size.margin + 'px';
    });
}
// wrapper
const setWrapper = (ele, idx, size) => {
    ele.wrapper.style.width = (size.width + size.margin) * ele.item.length + 'px';
    moveWrapper(ele, idx, size);
}
const moveWrapper = (ele, idx, size) => {
    ele.wrapper.style.marginLeft = ((size.width + size.margin) * idx.now) * -1 + 'px';
}
// container
const setContainer = (ele, idx, size) => {
    ele.container.style.width = size.width + size.margin + 'px';
}




const slide = carousel({
    selector: '#carousel',
    margin: 0,
    initialindex: 0,
});