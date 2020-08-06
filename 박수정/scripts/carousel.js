class slider {
    constructor(selector, option) {
        this.selector = document.querySelector(selector);
        this.CONTAINERNAME = 'slider__container';
        this.WRAPPERRNAME = 'slider__wrapper';
        this.ITEM = '.slider__item';
        this.NAVIGATIONNAME = 'slider__navigation';
        this.PREVBTN = '.slider__navigation__btn--prev';
        this.NEXTBTN = '.slider__navigation__btn--next';
        this.CONTROLTRANSITIONCLASS = 'transition--false'
        this.PAGINATIONITEM = 'pagination__item';
        this.activeIdx = 1;
        this.navigation = false;
        this.pagination = false;
        this.autoPlay = false;
        this.$wrapper = null;
        this.$paginatioContainer = null;
        this.containerWidth = null;
        this.realItems = null;
        this.fired = false;

        if (option) {
            this.navigation = option.navigation;
            this.pagination = option.pagination;
            this.autoPlay = option.autoPlay;
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
    setWidthSTYLE() {
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
    coordinateShift() {
        this.$wrapper.style.left = `-${this.activeIdx * this.containerWidth}px`;
    }
    animate(cb) {
        if (this.fired) return;

        this.$wrapper.classList.remove(this.CONTROLTRANSITIONCLASS);
        cb();
        this.coordinateShift();
    }
    setNavigationHTML() {
        const navigation = document.createElement('div');
        navigation.className = this.NAVIGATIONNAME;
        navigation.innerHTML = '<button type="button" class="slider__navigation__btn--prev">이전</button><button type=""button" class="slider__navigation__btn--next">다음</button>';

        this.selector.appendChild(navigation);
        this.selector.appendChild = '<div></div>';
    }
    setNavigationAct() {
        const PREVBTN = document.querySelector(this.PREVBTN);
        const NEXTBTN = document.querySelector(this.NEXTBTN);

        this.$wrapper.addEventListener('transitionstart', () => {
            this.fired = true;
        });

        this.$wrapper.ontransitionend = () => {
            this.fired = false;

            if (this.activeIdx === this.realItems.length) {
                this.activeIdx = 0;
                this.coordinateShift();
                this.$wrapper.classList.add(this.CONTROLTRANSITIONCLASS);
                return;
            }

            if (!this.activeIdx) {
                this.activeIdx = this.realItems.length;
                this.coordinateShift();
                this.$wrapper.classList.add(this.CONTROLTRANSITIONCLASS);
                return;
            }
        };

        PREVBTN.addEventListener('click', () => {
            this.animate(() => {
                this.activeIdx -= 1;
            })
        });

        NEXTBTN.addEventListener('click', () => {
            this.animate(() => {
                this.activeIdx += 1;
            })
        });
    }
    navigationInit() {
        this.setNavigationHTML();
        this.setNavigationAct();
    }
    setPaginationHTML() {
        const CONTROLCONTAINER = document.createElement('div');
        const PAGINATIONWRAPPER = document.createElement('ul');

        CONTROLCONTAINER.className = this.CONTROLCONTAINER;
        this.selector.append(CONTROLCONTAINER);
        CONTROLCONTAINER.append(PAGINATIONWRAPPER);

        for (let i = 0; i < this.realItems.length; i++) {
            const PAGINATIONLI = document.createElement('li');
            const PAGINATIONBTN = document.createElement('button');

            PAGINATIONWRAPPER.append(PAGINATIONLI);
            PAGINATIONBTN.type = 'button';
            PAGINATIONLI.classList.add(this.PAGINATIONITEM);
            PAGINATIONLI.append(PAGINATIONBTN);
            PAGINATIONBTN.append(i + 1);
        }

        this.$paginatioContainer = CONTROLCONTAINER;
    }
    chanePaginationActive() {
        const paginationLi = document.querySelectorAll(`.${this.CONTROLCONTAINER} li`);
        let activeIdx;

        for (var i = 0; i < paginationLi.length; i++) {
            paginationLi[i].classList.remove(`${this.PAGINATIONITEM}--active`);
        }

        paginationLi[this.activeIdx - 1].classList.add(`${this.PAGINATIONITEM}--active`);
    }
    paginationInit() {
        this.setPaginationHTML();
        this.chanePaginationActive();
    }
    autoPlayInit() {
        const _this = this;

        setInterval(()=> {
            this.animateNext(_this);
        }, 3000);
    }
    init() {
        this.setInitHTML();
        this.setWidthSTYLE();
        this.makeCloneHTML();
        this.coordinateShift();
        this.$wrapper.classList.add(this.CONTROLTRANSITIONCLASS);

        if (this.navigation) this.navigationInit();
        if (this.pagination) this.paginationInit();
        if (this.autoPlay) this.autoPlayInit();
    }
}