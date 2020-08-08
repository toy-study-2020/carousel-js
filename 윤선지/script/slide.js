(function(doc, win) {
  let defaults = {
    // layout
    frame: '.slide_frame',
    list: '.slide_list',
    slide: '.slide_bx',
    // paging
    paging: true,
    pagingEl: '.slide_paging',
    pagingActive: 'on',
    //prev, next button
    control: true,
    controlEl: '.slide_control',
    prevBtn: '.btn_preview',
    nextBtn: '.btn_next',
    
    speed: .2,
    autoplay: true,
    direction: true
  };

  function Slider(el, opt) {
    this.el = doc.querySelector(el);
    this.setObj = Object.assign(defaults, opt);

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
      this.frame = this.el.querySelector(this.setObj.frame);
      this.list = this.el.querySelector(this.setObj.list);
      this.slide = this.el.querySelectorAll(this.setObj.slide);
      this.pagingEl = this.el.querySelector(this.setObj.pagingEl);
      this.controlEl = this.el.querySelector(this.setObj.controlEl);
      this.prevBtn = "";
      this.nextBtn = "";
      this.pagingBtn = "";
      this.cloneNum = 2;
      this.frameWidth = this.frame.clientWidth;
      this.slideLength = this.slide.length;
      this.listWidth = this.frameWidth * (this.slideLength + this.cloneNum);
      this.currentPosi = -this.frame.clientWidth * (this.cloneNum / 2);
      this.currentCount = 0;
      this.eventFlag = false;

      if (this.setObj.paging) this.setPaging();
      if (this.setObj.control) this.setControl();
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

    setPaging: function() {
      let pagingDom = '',
          initClass = '';
      
      this.slide.forEach((slide, idx) => {
        initClass = (idx === this.currentCount) ? this.setObj.pagingActive : '';
        pagingDom += `<a href="#" class="page ${initClass}">${idx + 1}</a>`;
      });
      
      this.pagingEl.innerHTML = pagingDom;
      this.pagingBtn = this.pagingEl.querySelectorAll('.page');
    },

    setControl: function() {
      this.controlEl.innerHTML = 
      `<button type="button" class="btn_preview">이전</button>
       <button type="button" class="btn_next">다음</button>`;
      
      this.prevBtn = this.controlEl.querySelector(this.setObj.prevBtn);
      this.nextBtn = this.controlEl.querySelector(this.setObj.nextBtn);
    },

    cloneSlide: function () {
      let firstSlide = this.slide[0].cloneNode(true),
      lastSlide = this.slide[this.slideLength - 1].cloneNode(true);
      firstSlide.classList.add('clone_slide');
      lastSlide.classList.add('clone_slide');

      this.list.prepend(lastSlide);
      this.list.append(firstSlide);
    },

    eventBind: function() {
      if (this.setObj.control) {
        this.prevBtn.addEventListener('click', this.clickBtnEvt.bind(this));
        this.nextBtn.addEventListener('click', this.clickBtnEvt.bind(this));
      }
        
      if (this.setObj.paging) {
        this.pagingBtn.forEach((pagingBtn, idx) => {
          pagingBtn.addEventListener('click', this.clickPaging.bind(this, idx));
        });
      }
    },

    moveSlide: function (position, duration = this.setObj.speed) {
      this.list.style.transform = `translate3d(${position}px, 0, 0)`;
      this.list.style.transitionDuration = `${duration}s`;

      if (this.setObj.paging) this.togglePaging();
    },

    clickPaging: function (idx) {
      this.currentPosi = -this.frameWidth * (idx + 1);
      this.currentCount = idx;

      this.moveSlide(this.currentPosi);
    },

    togglePaging: function() {
      this.pagingBtn.forEach((item, idx) => {
        idx === this.currentCount ? 
          this.pagingBtn[idx].classList.add(this.setObj.pagingActive) : 
          this.pagingBtn[idx].classList.remove(this.setObj.pagingActive);
      });
    },

    clickBtnEvt: function(e) {
      if (this.eventFlag) return;
      this.eventFlag = true;

      if (e.target.className === 'btn_preview' && this.currentCount >= 0) {
        this.currentPosi += this.frameWidth;
        this.currentCount--;
      }
      
      if (e.target.className === 'btn_next' && this.currentCount < this.slideLength) {
        this.currentPosi -= this.frameWidth;
        this.currentCount++;
      }
  
      this.moveSlide(this.currentPosi);
      setTimeout(() => { this.eventFlag = false; }, 200);

      if(this.currentCount < 0 || this.currentCount >= this.slideLength) {
        if (this.currentCount < 0) {
          this.currentCount = this.slideLength - 1;
          this.currentPosi = -this.frameWidth * this.slideLength;
        };
  
        if (this.currentCount >= this.slideLength) {
          this.currentCount = 0;
          this.currentPosi = -this.frameWidth;
        };
  
        setTimeout(() => {
          this.moveSlide(this.currentPosi, 0);
        }, 200);
        if (this.setObj.paging) this.togglePaging();
      }
    }
  };

  let slide = new Slider('.slider_wrap');

})(document, window)