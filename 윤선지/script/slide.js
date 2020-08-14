let defaults = {
  frame: '.slide_frame',
  list: '.slide_list',
  slide: '.slide_bx',
  paging: false,
  pagingEl: '.slide_paging',
  pagingActive: 'on',
  control: true,
  controlEl: '.slide_control',
  prevBtn: '.btn_preview',
  nextBtn: '.btn_next',
  speed: 2000,
  autoplay: false,
  playdirection: true,
  autospeed: 2000,
  playControl: false,
  playControlEl: '.play_control',
  btnStop: '.btn_stop',
  btnPlay: '.btn_play',
  playActive: 'on'
};

function Slider(el, opt) {
  this.el = document.querySelector(el);
  this.setOpt = Object.assign(defaults, opt);

  this.init();
};

Slider.prototype = {
  init: function () {
    this.setElement();
    this.setSlideSize();
    this.cloneSlide();
    this.eventBind();
  },

  setElement: function () {
    this.frame = this.el.querySelector(this.setOpt.frame);
    this.list = this.el.querySelector(this.setOpt.list);
    this.slide = this.el.querySelectorAll(this.setOpt.slide);
    this.pagingEl = "";
    this.controlEl = "";
    this.playControlEl = "";
    this.prevBtn = "";
    this.nextBtn = "";
    this.pagingBtn = "";
    this.btnStop = "";
    this.btnPlay = "";
    this.timer = "";

    this.cloneNum = 2;
    this.frameWidth = this.frame.clientWidth;
    this.slideLength = this.slide.length;
    this.listWidth = this.frameWidth * (this.slideLength + this.cloneNum);
    this.currentPosi = -this.frame.clientWidth * (this.cloneNum / 2);
    this.currentCount = 0;
    this.isEvent = false;

    if (this.setOpt.paging) this.setPaging();
    if (this.setOpt.control) this.setControl();
    if (this.setOpt.autoplay) this.setAutoplay();
    if (this.setOpt.playControl) this.setControlPlay();
  },

  setSlideSize: function () {
    this.list.setAttribute('style',
      `width: ${this.listWidth}px;
      transform: translate3d(${this.currentPosi}px, 0, 0);`
    );

    this.slide.forEach((slide, idx) => {
      slide.setAttribute('style', `width: ${this.frameWidth}px;`);
    });
  },

  replaceClass: function(className) {
    return className.replace('.', '');
  },

  setPaging: function() {
    let pagingDom = '',
        initClass = '';

    this.el.insertAdjacentHTML('beforeend', 
      `<div class="${this.replaceClass(this.setOpt.pagingEl)}"></div>`);
    this.pagingEl = this.el.querySelector(this.setOpt.pagingEl);
    
    this.slide.forEach((slide, idx) => {
      initClass = (idx === this.currentCount) ? this.setOpt.pagingActive : '';
      pagingDom += `<a href="#" class="page ${initClass}">${idx + 1}</a>`;
    });
    
    this.pagingEl.innerHTML = pagingDom;
    this.pagingBtn = this.pagingEl.querySelectorAll('.page');
  },

  setControl: function() {
    this.el.insertAdjacentHTML('beforeend', 
      `<div class="${this.replaceClass(this.setOpt.controlEl)}"></div>`);
    this.controlEl = this.el.querySelector(this.setOpt.controlEl);

    this.controlEl.innerHTML = 
    `<button type="button" class="${this.replaceClass(this.setOpt.prevBtn)}">이전</button>
      <button type="button" class="${this.replaceClass(this.setOpt.nextBtn)}">다음</button>`;
    
    this.prevBtn = this.controlEl.querySelector(this.setOpt.prevBtn);
    this.nextBtn = this.controlEl.querySelector(this.setOpt.nextBtn);
  },

  setAutoplay: function() {
    this.timer = setInterval(() => {
      this.setOpt.playdirection ? this.clickNext() : this.clickPrev();
    }, this.setOpt.autospeed);
  },

  setControlPlay: function() {
    this.el.insertAdjacentHTML('beforeend', 
      `<div class="${this.replaceClass(this.setOpt.playControlEl)}"></div>`);

    this.playControlEl = this.el.querySelector(this.setOpt.playControlEl)

    this.playControlEl.innerHTML = 
      `<button type="button" class="${this.replaceClass(this.setOpt.btnStop)}">정지</button>
        <button type="button" class="${this.replaceClass(this.setOpt.btnPlay)}">재생</button>`;

    this.btnStop = this.playControlEl.querySelector(this.setOpt.btnStop);
    this.btnPlay = this.playControlEl.querySelector(this.setOpt.btnPlay);
  },

  setSpeed: function(speed) {
    return speed / 10000;
  },
  
  cloneSlide: function () {
    let firstSlide = this.slide[0].cloneNode(true),
    lastSlide = this.slide[this.slideLength - (this.cloneNum / 2)].cloneNode(true);
    firstSlide.classList.add('clone_slide');
    lastSlide.classList.add('clone_slide');

    this.list.prepend(lastSlide);
    this.list.append(firstSlide);
  },

  eventBind: function() {
    if (this.setOpt.control) {
      this.prevBtn.addEventListener('click', this.clickPrev.bind(this));
      this.nextBtn.addEventListener('click', this.clickNext.bind(this));
    }
      
    if (this.setOpt.paging) {
      this.pagingBtn.forEach((pagingBtn, idx) => {
        pagingBtn.addEventListener('click', this.clickPaging.bind(this, idx));
      });
    }

    // if (this.setOpt.autoplay) {
    //   this.frame.addEventListener('mouseenter', () => {
    //     this.slideStop();
    //   });
      
    //   this.frame.addEventListener('mouseleave', () => {
    //     this.slidePlay();
    //   });
    // }

    if (this.setOpt.playControl) {
      this.btnStop.addEventListener('click', this.slideStop.bind(this));
      this.btnPlay.addEventListener('click', this.slidePlay.bind(this));
    }

    this.list.addEventListener('transitionstart', () => this.isEvent = true);
    this.list.addEventListener('transitionend', this.checkCondition.bind(this));
  },

  moveSlide: function (position, duration = this.setSpeed(this.setOpt.speed)) {
    this.list.style.transform = `translate3d(${position}px, 0, 0)`;
    this.list.style.transitionDuration = `${duration}s`;

    if (this.setOpt.paging) this.togglePaging();
  },

  clickPrev: function() {
    this.clickBtnEvt('prev');
  },

  clickNext: function() {
    this.clickBtnEvt('next');
  },

  clickBtnEvt: function(direction) {
    if (this.isEvent) return;

    switch(direction) {
      case 'prev': 
        this.currentPosi += this.frameWidth;
        this.currentCount--;
        break;
      case 'next': 
        this.currentPosi -= this.frameWidth;
        this.currentCount++;
        break;
    }
    
    this.moveSlide(this.currentPosi);
    return this.currentCount;
  },

  checkCondition: function() {
    if (this.currentCount < 0) {
      this.currentCount = this.slideLength - 1;
      this.currentPosi = -this.frameWidth * this.slideLength;
  
      this.moveSlide(this.currentPosi, 0);
    };

    if (this.currentCount >= this.slideLength) {
      this.currentCount = 0;
      this.currentPosi = -this.frameWidth;
      
      this.moveSlide(this.currentPosi, 0);
    };

    this.isEvent = false;
  },

  clickPaging: function (idx) {
    this.currentPosi = -this.frameWidth * (idx + 1);
    this.currentCount = idx;

    this.moveSlide(this.currentPosi);
  },

  togglePaging: function() {
    this.pagingBtn.forEach((item, idx) => {
      idx === this.currentCount ? 
        this.pagingBtn[idx].classList.add(this.setOpt.pagingActive) : 
        this.pagingBtn[idx].classList.remove(this.setOpt.pagingActive);
    });
  },

  slideStop: function() {
    this.btnPlay.classList.remove(this.setOpt.playActive);
    this.btnStop.classList.add(this.setOpt.playActive);
    clearInterval(this.timer);
  },

  slidePlay: function() {
    this.btnPlay.classList.add(this.setOpt.playActive);
    this.btnStop.classList.remove(this.setOpt.playActive);
    this.setAutoplay();
  }
};

let slide = new Slider('.slider_wrap',
  {
    paging: true,
    autoplay: true,
    playControl: true
  }
);
