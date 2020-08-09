class Slider {
    constructor(selector, option) {
        this.selector = document.querySelector(selector);
        this.containername = 'slider__container';
        this.wrapperName = 'slider__wrapper';
        this.item = '.slider__item';
        this.navigationname = 'slider__navigation';
        this.prevbtn = '.slider__navigation__btn--prev';
        this.nextbtn = '.slider__navigation__btn--next';
        this.controltransitionclass = 'transition--false';
        this.controlcontainer = 'control__container';
        this.controlplayerbtn = 'control__player';
        this.PAGINATIONitem = 'pagination__item';
        this.controlplayerclass = 'player--false';
        this.controlplayerstatearr = ['정지', '재생'];
        this.$controllerContainer = document.createElement('div');
        this.activeIdx = 1;
        this.timer = 3000;
        this.transitionSpeed = 0;
        this.navigation = false;
        this.pagination = false;
        this.autoPlay = true;
        this.controlPlayer = false;
        this.fired = false;
        this.$wrapper = null;
        this.containerWidth = null;
        this.realItems = null;
        this.playerTimer = null;
        this.paginationLi = null;

        if (option) {
            this.navigation = option.navigation;
            this.pagination = option.pagination;
            this.autoPlay = option.autoPlay;
            this.controlPlayer = option.controlPlay;
            this.transitionSpeed = option.transitionSpeed;
            if (option.timer) this.timer = option.timer;
        }

        if (this.controlPlayer) {
            this.$playerBtn = document.createElement('button');
        }
    }
    setInitHTML() {
        const wrapper = document.createElement('div');
        const slideItemHTML = this.selector.innerHTML;

        this.selector.classList.add(this.containername);
        this.selector.innerHTML = '';
        this.selector.appendChild(wrapper);

        wrapper.innerHTML = slideItemHTML;
        wrapper.className = this.wrapperName;
        this.$wrapper = document.querySelector(`.${this.wrapperName}`);
    }
    setWidthSTYLE() {
        this.realItems = document.querySelectorAll(this.item);
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

        this.$wrapper.classList.remove(this.controltransitionclass);
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
        this.$wrapper.classList.add(this.controltransitionclass);
    }
    setNavigationHTML() {
        const navigation = document.createElement('div');
        navigation.className = this.navigationname;
        navigation.innerHTML = '<button type="button" class="slider__navigation__btn--prev">이전</button><button type=""button" class="slider__navigation__btn--next">다음</button>';

        this.selector.appendChild(navigation);
        this.selector.appendChild = '<div></div>';
    }
    setNavigationAct() {
        const _this = this;
        const prevbtn = document.querySelector(this.prevbtn);
        const nextbtn = document.querySelector(this.nextbtn);

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

            if (this.pagination) this.changePaginationActive();
        };

        prevbtn.addEventListener('click', () => {
            this.animatePrev(_this);
        });

        nextbtn.addEventListener('click', () => {
            this.animateNext(_this);
        });
    }
    navigationInit() {
        this.setNavigationHTML();
        this.setNavigationAct();
    }
    makeControlContainer() {
        if (!document.querySelector(`.${this.controlcontainer}`)) {
            this.$controllerContainer.className = this.controlcontainer;
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
            PAGINATIONLI.classList.add(this.PAGINATIONitem);
            PAGINATIONLI.append(PAGINATIONBTN);
            PAGINATIONBTN.append(i + 1);
        }
    }
    changePaginationActive() {
        this.paginationLi = document.querySelectorAll(`.${this.controlcontainer} li`);
        let activeIdx;

        for (var i = 0; i < this.paginationLi.length; i++) {
            this.paginationLi[i].classList.remove(`${this.PAGINATIONitem}--active`);
        }

        this.paginationLi[this.activeIdx - 1].classList.add(`${this.PAGINATIONitem}--active`);
    }
    movePaging() {
        const _this = this;
        for (var i = 0; i < this.paginationLi.length; i++) {
            {
                (function (index) {
                    _this.paginationLi[i].addEventListener('click', () => {
                        _this.animate(() => {
                            _this.activeIdx = index + 1;
                        })
                    });
                })(i);
            }
        }
    }
    paginationInit() {
        this.setPaginationHTML();
        this.changePaginationActive();
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
        this.$playerBtn.innerText = this.controlplayerstatearr[0];
        this.$playerBtn.classList.add(this.controlplayerbtn);
        this.$controllerContainer.append(this.$playerBtn);
    }
    controlPlay() {
        this.$playerBtn.addEventListener('click', () => {
            this.$playerBtn.classList.toggle(this.controlplayerclass);
            this.$playerBtn.innerText = this.controlplayerstatearr[Number(this.$playerBtn.classList.contains(this.controlplayerclass))];

            if (this.$playerBtn.classList.contains(this.controlplayerclass)) {
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
    setTransitionSpeed() {
        const speed = `${this.transitionSpeed/1000}s`;
        this.$wrapper.style.transitionDuration = speed;
        for (var i = 0; i < this.paginationLi.length; i++) {
            this.paginationLi[i].children[0].style.transitionDuration = speed;
        }
    }
    init() {
        this.setInitHTML();
        this.setWidthSTYLE();
        this.makeCloneHTML();
        this.coordinateShift();
        this.$wrapper.classList.add(this.controltransitionclass);

        if (this.navigation) this.navigationInit();
        if (this.pagination) this.paginationInit();
        if (this.autoPlay) this.autoPlayInit(this.timer);
        if (this.controlPlayer) this.controlPlayerInit();
        if (this.transitionSpeed) this.setTransitionSpeed();
    }
}
