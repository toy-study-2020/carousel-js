class slider {
    constructor(selector, option) {
        this.selector = document.querySelector(selector);
        this.CONTAINERNAME = 'slider__container';
        this.WRAPPERRNAME = 'slider__wrapper';
        this.ITEM = '.slider__item';
        this.NAVIGATIONNAME = 'slider__navigation';
        this.navigation = false;

        if (option) {
            this.navigation = option.navigation
        }
    }
    makeHTML() {
        const wrapper = document.createElement('div');
        const slideItemHTML = this.selector.innerHTML;

        this.selector.classList.add(this.CONTAINERNAME);
        this.selector.innerHTML = '';
        this.selector.appendChild(wrapper);

        wrapper.innerHTML = slideItemHTML;
        wrapper.className = this.WRAPPERRNAME;
    }
    setWidth() {
        const items = document.querySelectorAll(this.ITEM);

        let getWidth = items[0].offsetWidth;

        const assignGetWidth = function (idx) {
            getWidth = items[idx].offsetWidth;
        };

        for (let i = 0; i < items.length; i++) {
            if (getWidth < items[i].offsetWidth) {
                assignGetWidth(i);
            }
        }

        for (let i = 0; i < items.length; i++) {
            items[i].style.width = `${getWidth}px`;
        }

        this.selector.style.width = `${getWidth}px`;
    }
    setNavigationHTML() {
        const navigation = document.createElement('div');
        navigation.className = this.NAVIGATIONNAME;
        navigation.innerHTML = '<button type="button" class="slider__navigation--prev">이전</button><button type=""button" class="slider__navigation--next">다음</button>';

        this.selector.appendChild(navigation);
        this.selector.appendChild = '<div></div>';
    }
    init() {
        this.makeHTML();
        this.setWidth();

        if (this.navigation) this.setNavigationHTML();
    }
}