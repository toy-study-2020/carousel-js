class slider {
    constructor(selector, option) {
        this.selector = document.querySelector(selector);
        this.CONTAINERNAME = 'slider__container';
        this.WRAPPERRNAME = 'slider__wrapper';
        this.ITEM = '.slider__item';
        this.NAVIGATIONNAME = 'slider__navigation';
        this.prevBtn = '.slider__navigation--prev';
        this.nextBtn = '.slider__navigation--next';
        this.activeIdx = 1;
        this.navigation = false;
        this.$wrapper = null;
        this.containerWidth = null;
        this.realItems = null;
        this.fired = false;

        if (option) {
            this.navigation = option.navigation;
        }
    }
    setInitHTML() {
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
        this.realItems = document.querySelectorAll(this.ITEM);
        let getWidth = this.realItems[0].offsetWidth;

        const assignGetWidth = function (idx) {
            getWidth = this.realItems[idx].offsetWidth;
        };

        for (let i = 0; i < this.realItems.length; i++) {
            if (getWidth < this.realItems[i].offsetWidth) {
                assignGetWidth(i);
            }
        }

        for (let i = 0; i < this.realItems.length; i++) {
            this.realItems[i].style.width = `${getWidth}px`;
        }

        this.selector.style.width = `${getWidth}px`;
        this.containerWidth = getWidth;
    }
    makeCloneHTML() {
        const firstItem = this.realItems[0].cloneNode(true);
        const lastItem = this.realItems[this.realItems.length - 1].cloneNode(true);

        this.$wrapper.appendChild(firstItem)
        this.$wrapper.prepend(lastItem)
    }
    moveInit() {

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

        this.$wrapper.addEventListener('transitionstart', () => {
            console.log('ontransitionstart')

            this.fired = true;
        });

        this.$wrapper.ontransitionend = () => {
            console.log('ontransitionend')
            this.fired = false;

            if (this.activeIdx === this.realItems.length) {
                this.activeIdx = 0;
                this.move(0);
                this.$wrapper.classList.add('transition--false');
                return;
            }

            if (!this.activeIdx) {
                this.activeIdx = this.realItems.length;
                this.move(0);
                this.$wrapper.classList.add('transition--false');
                return;
            }

        };

        prevBtn.addEventListener('click', event => {
            if (this.fired) {
                return;
            }

            _this.$wrapper.classList.remove('transition--false');

            if (this.activeIdx) {
                this.activeIdx -= 1;
                this.move();

                return;
            } /* else {
                this.activeIdx = this.realItems.length - 1;
                this.move(0);
            } */

            // this.move();
        });

        nextBtn.addEventListener('click', event => {
            if(this.fired) {
                return;
            }

            _this.$wrapper.classList.remove('transition--false');

            console.log('click')
            if (this.activeIdx < this.realItems.length) {
                this.activeIdx += 1;
                this.move();
            } 
        });
    }
    navigationInit() {
        this.setNavigationHTML();
        this.setNavigationAct();
    }
    move(time) {
        this.allItems = document.querySelectorAll(this.ITEM);

        this.$wrapper.style.left = `-${this.activeIdx * this.containerWidth}px`;

        for (let i = 0; i < this.allItems.length; i++) {
            this.allItems[i].classList.remove('active');
        }
        this.allItems[this.activeIdx].classList.add('active');
    }
    init() {
        this.setInitHTML();
        this.setWidth();
        this.makeCloneHTML();
        this.move(0);
        this.$wrapper.classList.add('transition--false');

        if (this.navigation) this.navigationInit();
    }
}