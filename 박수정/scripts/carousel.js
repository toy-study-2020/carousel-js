class slider {
    constructor(selector, option) {
        this.selector = document.querySelector(selector);
        this.CONTAINERNAME = 'slider__container';
        this.WRAPPERRNAME = 'slider__wrapper';
        this.ITEM = '.slider__item';
        this.NAVIGATIONNAME = 'slider__navigation';
        this.PREVBTN = '.slider__navigation__btn--prev';
        this.NEXTBTN = '.slider__navigation__btn--next';
        this.CONTROLTRANSITIONCLASS = 'transition--false';
        this.CONTROLCONTAINER = 'control__container';
        this.CONTROLPLAYERBTN = 'control__player';
        this.PAGINATIONITEM = 'pagination__item';
        this.CONTROLPLAYERCLASS = 'player--false';
        this.CONTROLPLAYERSTATEARR = ['정지', '재생'];
        this.$controllerContainer = document.createElement('div');
        this.activeIdx = 1;
        this.timer = 3000;
        this.navigation = false;
        this.pagination = false;
        this.autoPlay = true;
        this.controlPlayer = false;
        this.fired = false;
        this.$wrapper = null;
        this.containerWidth = null;
        this.realItems = null;
        this.playerTimer = null;

        if (option) {
            this.navigation = option.navigation;
            this.pagination = option.pagination;
            this.autoPlay = option.autoPlay;
            this.controlPlayer = option.controlPlay;
            if (option.timer) this.timer = option.timer;
        }

        if (this.controlPlayer) {
            this.$playerBtn = document.createElement('button');
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
    animatePrev(_this) {
        _this.animate(() => {
            this.activeIdx -= 1;
        })
    }
    animateNext(_this) {
        _this.animate(() => {
            this.activeIdx += 1;
        })
    }
    changeBackAndForth(cb) {
        cb();
        this.coordinateShift();
        this.$wrapper.classList.add(this.CONTROLTRANSITIONCLASS);
    }
    setNavigationHTML() {
        const navigation = document.createElement('div');
        navigation.className = this.NAVIGATIONNAME;
        navigation.innerHTML = '<button type="button" class="slider__navigation__btn--prev">이전</button><button type=""button" class="slider__navigation__btn--next">다음</button>';

        this.selector.appendChild(navigation);
        this.selector.appendChild = '<div></div>';
    }
    setNavigationAct() {
        const _this = this;
        const PREVBTN = document.querySelector(this.PREVBTN);
        const NEXTBTN = document.querySelector(this.NEXTBTN);

        this.$wrapper.addEventListener('transitionstart', () => {
            this.fired = true;
        });

        this.$wrapper.ontransitionend = () => {
            this.fired = false;

            if (this.activeIdx === this.realItems.length) {
                this.changeBackAndForth(() => {
                    this.activeIdx = 0;
                })
            }

            if (!this.activeIdx) {
                this.changeBackAndForth(() => {
                    this.activeIdx = this.realItems.length;
                })
            }

            if (this.activeIdx > this.realItems.length) {
                this.changeBackAndForth(() => {
                    this.activeIdx = this.activeIdx - this.realItems.length;
                })
            }

            if (this.pagination) this.chanePaginationActive();
        };

        PREVBTN.addEventListener('click', () => {
            this.animatePrev(_this);
        });

        NEXTBTN.addEventListener('click', () => {
            this.animateNext(_this);
        });
    }
    navigationInit() {
        this.setNavigationHTML();
        this.setNavigationAct();
    }
    makeControlContainer() {
        if (!document.querySelector(`.${this.CONTROLCONTAINER}`)) {
            this.$controllerContainer.className = this.CONTROLCONTAINER;
            this.selector.append(this.$controllerContainer);
        }
    }
    setPaginationHTML() {
        this.makeControlContainer();
        const PAGINATIONWRAPPER = document.createElement('ul');
        this.$controllerContainer.append(PAGINATIONWRAPPER);

        for (let i = 0; i < this.realItems.length; i++) {
            const PAGINATIONLI = document.createElement('li');
            const PAGINATIONBTN = document.createElement('button');

            PAGINATIONWRAPPER.append(PAGINATIONLI);
            PAGINATIONBTN.type = 'button';
            PAGINATIONLI.classList.add(this.PAGINATIONITEM);
            PAGINATIONLI.append(PAGINATIONBTN);
            PAGINATIONBTN.append(i + 1);
        }
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
        this.movePaging();
    }
    clearTimer() {
        clearInterval(this.playerTimer);
        this.playerTimer = null;
    }
    autoPlayInit(timer) {
        const _this = this;

        if (this.playerTimer !== null) return;
        this.playerTimer = setInterval(()=> {
            this.animateNext(_this);
        }, timer);
    }
    setPlayerHTML() {
        this.makeControlContainer();
        this.$playerBtn.type = 'button';
        this.$playerBtn.innerText = this.CONTROLPLAYERSTATEARR[0];
        this.$playerBtn.classList.add(this.CONTROLPLAYERBTN);
        this.$controllerContainer.append(this.$playerBtn);
    }
    controlPlay() {
        this.$playerBtn.addEventListener('click', () => {
            this.$playerBtn.classList.toggle(this.CONTROLPLAYERCLASS);
            this.$playerBtn.innerText = this.CONTROLPLAYERSTATEARR[Number(this.$playerBtn.classList.contains(this.CONTROLPLAYERCLASS))];

            if (this.$playerBtn.classList.contains(this.CONTROLPLAYERCLASS)) {
                this.clearTimer();
            } else {
                this.autoPlayInit(this.timer);
            }
        });
    }
    controlPlayerInit() {
        this.setPlayerHTML()
        this.controlPlay();
    }
    init() {
        this.setInitHTML();
        this.setWidthSTYLE();
        this.makeCloneHTML();
        this.coordinateShift();
        this.$wrapper.classList.add(this.CONTROLTRANSITIONCLASS);

        if (this.navigation) this.navigationInit();
        if (this.pagination) this.paginationInit();
        if (this.autoPlay) this.autoPlayInit(this.timer);
        if (this.controlPlayer) this.controlPlayerInit();
    }
}
