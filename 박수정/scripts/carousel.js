class Slider {
    constructor(selector, option) {
        this.selector = document.querySelector(selector);
        this.containernName = 'slider__container';
        this.wrapperName = 'slider__wrapper';
        this.item = '.slider__item';
        this.navigationName = 'slider__navigation';
        this.prevBtn = '.slider__navigation__btn--prev';
        this.nextBtn = '.slider__navigation__btn--next';
        this.controlTransitionClass = 'transition--false';
        this.controlContainer = 'control__container';
        this.controlPlayerBtn = 'control__player';
        this.paginationItem = 'pagination__item';
        this.controlPlayerClass = 'player--false';
        this.controlPlayerStateArr = ['정지', '재생'];
        this.controllerContainer = document.createElement('div');
        this.activeIdx = 1;
        this.timer = 3000;
        this.transitionSpeed = 0;
        this.navigation = false;
        this.pagination = false;
        this.autoPlay = true;
        this.controlPlayer = false;
        this.fired = false;
        this.wrapper = null;
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
            this.playerBtn = document.createElement('button');
        }
    }
    setInitHTML() {
        const wrapper = document.createElement('div');
        const slideItemHTML = this.selector.innerHTML;

        this.selector.classList.add(this.containernName);
        this.selector.innerHTML = '';
        this.selector.appendChild(wrapper);

        wrapper.innerHTML = slideItemHTML;
        wrapper.className = this.wrapperName;
        this.wrapper = document.querySelector(`.${this.wrapperName}`);
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

        this.wrapper.appendChild(firstItem)
        this.wrapper.prepend(lastItem)
    }
    coordinateShift() {
        this.wrapper.style.left = `-${this.activeIdx * this.containerWidth}px`;
    }
    animate(cb) {
        if (this.fired) return;

        this.wrapper.classList.remove(this.controlTransitionClass);
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
        this.wrapper.classList.add(this.controlTransitionClass);
    }
    setNavigationHTML() {
        const navigation = document.createElement('div');
        navigation.className = this.navigationName;
        navigation.innerHTML = '<button type="button" class="slider__navigation__btn--prev">이전</button><button type=""button" class="slider__navigation__btn--next">다음</button>';

        this.selector.appendChild(navigation);
        this.selector.appendChild = '<div></div>';
    }
    setNavigationAct() {
        const prevBtn = document.querySelector(this.prevBtn);
        const nextBtn = document.querySelector(this.nextBtn);

        this.wrapper.addEventListener('transitionstart', () => {
            this.fired = true;
        });

        this.wrapper.ontransitionend = () => {
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

        prevBtn.addEventListener('click', () => {
            this.animatePrev(this);
        });

        nextBtn.addEventListener('click', () => {
            this.animateNext(this);
        });
    }
    navigationInit() {
        this.setNavigationHTML();
        this.setNavigationAct();
    }
    makeControlContainer() {
        if (!document.querySelector(`.${this.controlContainer}`)) {
            this.controllerContainer.className = this.controlContainer;
            this.selector.append(this.controllerContainer);
        }
    }
    setPaginationHTML() {
        this.makeControlContainer();
        const paginationwrapper = document.createElement('ul');
        this.controllerContainer.append(paginationwrapper);

        for (let i = 0; i < this.realItems.length; i++) {
            const paginationli = document.createElement('li');
            const paginationbtn = document.createElement('button');

            paginationwrapper.append(paginationli);
            paginationbtn.type = 'button';
            paginationli.classList.add(this.paginationItem);
            paginationli.append(paginationbtn);
            paginationbtn.append(i + 1);
        }
    }
    changePaginationActive() {
        this.paginationLi = document.querySelectorAll(`.${this.controlContainer} li`);
        let activeIdx;

        for (var i = 0; i < this.paginationLi.length; i++) {
            this.paginationLi[i].classList.remove(`${this.paginationItem}--active`);
        }

        this.paginationLi[this.activeIdx - 1].classList.add(`${this.paginationItem}--active`);
    }
    movePaging() {
        const _this = this;
        const moveActiveSlide = function (index) {
            _this.paginationLi[i].addEventListener('click', () => {
                _this.animate(() => {
                    _this.activeIdx = index + 1;
                })
            });
        }

        for (var i = 0; i < this.paginationLi.length; i++) {
            moveActiveSlide(i);
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
        this.playerBtn.type = 'button';
        this.playerBtn.innerText = this.controlPlayerStateArr[0];
        this.playerBtn.classList.add(this.controlPlayerBtn);
        this.controllerContainer.append(this.playerBtn);
    }
    controlPlay() {
        this.playerBtn.addEventListener('click', () => {
            this.playerBtn.classList.toggle(this.controlPlayerClass);
            this.playerBtn.innerText = this.controlPlayerStateArr[Number(this.playerBtn.classList.contains(this.controlPlayerClass))];

            if (this.playerBtn.classList.contains(this.controlPlayerClass)) {
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
        this.wrapper.style.transitionDuration = speed;
        for (var i = 0; i < this.paginationLi.length; i++) {
            this.paginationLi[i].children[0].style.transitionDuration = speed;
        }
    }
    init() {
        this.setInitHTML();
        this.setWidthSTYLE();
        this.makeCloneHTML();
        this.coordinateShift();
        this.wrapper.classList.add(this.controlTransitionClass);

        if (this.navigation) this.navigationInit();
        if (this.pagination) this.paginationInit();
        if (this.autoPlay) this.autoPlayInit(this.timer);
        if (this.controlPlayer) this.controlPlayerInit();
        if (this.transitionSpeed) this.setTransitionSpeed();
    }
}
