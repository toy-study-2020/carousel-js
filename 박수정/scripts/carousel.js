class slider {
    constructor(selector, option) {
        this.selector = document.querySelector(selector);
        this.CONTAINERNAME = 'slider__container';
        this.WRAPPERRNAME = 'slider__wrapper';
        this.ITEM = '.slider__item';
        this.NAVIGATIONNAME = 'slider__navigation';
        this.prevBtn = '.slider__navigation--prev';
        this.nextBtn = '.slider__navigation--next';
        this.activeIdx = 0;
        this.navigation = false;
        this.$wrapper = null;
        this.containerWidth = null;
        this.items = null;

        if (option) {
            this.navigation = option.navigation;
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
        this.$wrapper = document.querySelector(`.${this.WRAPPERRNAME}`);
    }
    setWidth() {
        this.items = document.querySelectorAll(this.ITEM);
        let getWidth = this.items[0].offsetWidth;

        const assignGetWidth = function (idx) {
            getWidth = this.items[idx].offsetWidth;
        };

        for (let i = 0; i < this.items.length; i++) {
            if (getWidth < this.items[i].offsetWidth) {
                assignGetWidth(i);
            }
        }

        for (let i = 0; i < this.items.length; i++) {
            this.items[i].style.width = `${getWidth}px`;
        }

        this.selector.style.width = `${getWidth}px`;
        this.containerWidth = getWidth;
    }
    setNavigationHTML() {
        const navigation = document.createElement('div');
        navigation.className = this.NAVIGATIONNAME;
        navigation.innerHTML = '<button type="button" class="slider__navigation--prev">이전</button><button type=""button" class="slider__navigation--next">다음</button>';

        this.selector.appendChild(navigation);
        this.selector.appendChild = '<div></div>';
    }
    setNavigationAct() {
        const prevBtn = document.querySelector(this.prevBtn);
        const nextBtn = document.querySelector(this.nextBtn);
        let _this = this;

        prevBtn.addEventListener('click', event => {
            if (this.activeIdx) {
                this.activeIdx -= 1;
            } else {
                this.activeIdx = this.items.length - 1;
            }

            this.move();
        });

        nextBtn.addEventListener('click', event => {
            if (this.activeIdx < this.items.length - 1) {
                this.activeIdx += 1;
            } else {
                this.activeIdx = 0;
            }

            this.move();
        });
    }
    navigationInit() {
        this.setNavigationHTML();
        this.setNavigationAct();
    }
    move() {
        console.log(this.activeIdx)
        this.$wrapper.style.left = `-${this.activeIdx * this.containerWidth}px`;
    }
    init() {
        this.makeHTML();
        this.setWidth();

        if (this.navigation) this.navigationInit();
    }
}