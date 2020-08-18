const carouselPrototype = (function() {
  'use strict';
  const Carousel = function(args) {
    if (!args) {
      return;
    }

    const defaults = {
      mode: 'horizontal',
      elWrapper: 'ul',
      el: 'li',
      slideView: 1,
      control: 1,
      indicator: 1,
      loop: 1,
      autoplay: 1,
      endEvent: () => {}
    }

    this.mode = args.mode ? args.mode : defaults.mode;
    this.wrapperType = typeof args;
    this.wrapper =
      this.wrapperType === 'object'
        ? document.querySelector(args.wrapper)
        : document.querySelector(args);
    this.elWrapper =
      args.elWrapper
        ? this.wrapper.querySelector(args.elWrapper)
        : this.wrapper.querySelector(defaults.elWrapper);
    this.el =
      args.el
        ? this.elWrapper.querySelectorAll(args.el)
        : this.elWrapper.querySelectorAll(defaults.el);
    this.slideView = args.slideView ? args.slideView : 1;
    this.control = args.control ? args.control : defaults.control;
    this.indicator = args.indicator ? args.indicator : defaults.indicator;
    this.loop = args.loop ? args.loop : defaults.loop;
    this.autoplay = args.autoplay ? args.autoplay : defaults.autoplay;
    this.endEvent = args.endEvent ? args.endEvent : defaults.endEvent;
    this.lengthEl = this.el.length;
    this.moveTarget = null;
    this.indexFirst = 0;
    this.indexLast = this.lengthEl - 1;
    this.cloneCount = 2;
    this.translateXLeft = -1;
    this.index = 1;
    this.isMove = true;

    this.init();

    if (this.control) {
      this.createControl();
    }

    if (this.indicator) {
      this.createIndicator();
    }

    this.timer = function() {
      this.auto = setInterval(function() {
        this.onMove('next');
      }.bind(this), 3000);
    }

    if (this.autoplay) {
      this.timer();
    }

    this.wrapper.addEventListener('mouseenter', function() {
      clearInterval(this.auto);
    }.bind(this));

    this.wrapper.addEventListener('mouseleave', function() {
      this.timer();
    }.bind(this));

    this.endEvent();
  };

  Carousel.prototype.init = function() {
    this.wrapper.classList.add('carouselWrapper');
    this.elWrapper.classList.add('carousel');
    this.wrapperWidth = this.wrapper.offsetWidth;

    if (this.loop) {
      this.clone(this.el[this.indexFirst], 'beforeend');
      this.clone(this.el[this.indexLast], 'afterbegin');
    }

    this.setWidth();
  };

  Carousel.prototype.setWidth = function() {
    for (let i = 0; i < this.lengthEl; i++) {
      if (this.slideView !== 1) {
        return;
      }
      this.el[i].style.cssText = 'width: ' + this.wrapperWidth + 'px;';
      this.el[i].classList.add('slide');
      this.el[this.indexFirst].classList.add('active');
    }

    this.setWrapperWidth();
  };

  Carousel.prototype.setWrapperWidth = function() {
    this.updateLengthEl = this.loop ? this.lengthEl + this.cloneCount : this.lengthEl;
    this.transformX = this.loop ? this.translateXLeft * this.wrapperWidth : 0;
    this.elWrapper.style.cssText = 'width: '+ this.wrapperWidth * this.updateLengthEl + 'px; transform: translateX(' + this.transformX + 'px);';
  };

  Carousel.prototype.clone = function(el, direction) {
    this.cloneEl = el.cloneNode(true);
    this.cloneEl.classList.add('clone');
    this.cloneEl.style.cssText = 'width: ' + this.wrapperWidth + 'px;';
    this.elWrapper.insertAdjacentElement(direction, this.cloneEl);
  };

  Carousel.prototype.createEl = function(el) {
    return document.createElement(el);
  };

  Carousel.prototype.createControl = function() {
    this.controlList = this.createEl('div');
    this.controlPrev = this.createEl('button');
    this.controlNext = this.createEl('button');
    this.controlList.classList.add('carouselController');
    this.setControl();
  };

  Carousel.prototype.setControl = function() {
    this.controlPrev.setAttribute('data-direction', 'prev');
    this.controlNext.setAttribute('data-direction', 'next');
    this.controlPrev.innerText = 'prev';
    this.controlNext.innerText = 'next';
    this.controlPrev.addEventListener('click', this.handlerControl.bind(this));
    this.controlNext.addEventListener('click', this.handlerControl.bind(this));
    this.appendControl();
  };

  Carousel.prototype.appendControl = function() {
    this.controlList.appendChild(this.controlPrev);
    this.controlList.appendChild(this.controlNext);
    this.appendCarousel(this.controlList);
  }

  Carousel.prototype.createIndicator = function() {
    this.indicatorList = this.createEl('ol');
    for (let i = 0; i < this.lengthEl; i++) {
      this.indicatorList.appendChild(this.createEl('li'));
    }
    this.indicatorList.classList.add('carouselIndicator');
    this.setIndicator();
  };

  Carousel.prototype.setIndicator = function() {
    this.indicatorEl = this.indicatorList.getElementsByTagName('li');
    for (let i = 0; i < this.lengthEl; i++) {
      this.indicatorEl[i].innerHTML = i;
      this.indicatorEl[i].setAttribute('data-index', i);
      this.indicatorIndex = this.indicatorEl[i].getAttribute('data-index');
      this.indicatorEl[i].addEventListener('click', this.onMove.bind(this, this.indicatorIndex));
    }

    this.indicatorInit();
    this.appendCarousel(this.indicatorList);
  };

  Carousel.prototype.indicatorInit = function() {
    this.indicatorEl[this.indexFirst].classList.add('active');
  };

    Carousel.prototype.appendCarousel = function(el) {
    this.wrapper.appendChild(el);
  };

  Carousel.prototype.handlerControl = function() {
    this.elWrapper.addEventListener('transitionrun', function() {
      this.isMove = false;
    }.bind(this));

    this.elWrapper.addEventListener('transitionend', function() {
      this.isMove = true;
    }.bind(this));

    this.moveTarget = event.target;
    this.targetData = this.moveTarget.dataset.direction;

    if (this.isMove) this.onMove(this.targetData);

  };

  Carousel.prototype.onMove = function(direction) {
    if (direction === 'prev') {
      this.index = this.index === 0 ? this.lengthEl : --this.index;
    } else if (direction === 'next') {
      this.index = this.index > this.lengthEl ? 0 : ++this.index;
    } else {
      this.index = Number(direction) + 1;
    }

    this.onAnimate();
    this.onIndicator(this.index);
  };

  Carousel.prototype.onAnimate = function() {
    this.moveTransform = this.wrapperWidth * this.index * this.translateXLeft;
    this.elWrapper.style.transition = 'all .3s';
    this.elWrapper.style.transform = 'translateX(' + this.moveTransform + 'px)';

    this.elWrapper.addEventListener('transitionend', function() {
      if (this.index > this.lengthEl) {
        this.onAnimateClone('last');
      }
      if (this.index === this.indexFirst) {
        this.onAnimateClone('first');
      }
    }.bind(this));
  };

  Carousel.prototype.onAnimateClone = function(state) {
    this.elWrapper.style.transition = 'all 0s';
    if (state === 'last') {
      this.elWrapper.style.transform = 'translateX(' + this.wrapperWidth * this.translateXLeft + 'px)';
      this.index = this.indexFirst + this.cloneCount / 2;
    } else {
      this.elWrapper.style.transform = 'translateX(' + this.wrapperWidth * this.lengthEl * this.translateXLeft + 'px)';
      this.index = this.lengthEl;
    }
  };

  Carousel.prototype.onIndicator = function(i) {
    for (let i = 0; i < this.lengthEl; i++) {
      this.indicatorList.querySelectorAll('li')[i].classList.remove('active');
      this.el[i].classList.remove('active');
    }

    this.indexIndicator =
      i > this.lengthEl
        ? this.indexFirst
        : i === this.indexFirst
        ? this.indexLast
        : --i;
    this.indicatorList.querySelector('li[data-index="' + this.indexIndicator  + '"]').classList.add('active');
    this.el[this.indexIndicator].classList.add('active');
  }

  return {
    Carousel
  }
})();
