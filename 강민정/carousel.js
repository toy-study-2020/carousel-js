;(function() {
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
    this.index = 1;

    this.init();

    if (this.control) {
      this.createControl();
    }

    if (this.indicator) {
      this.createIndicator();
    }

  };

  Carousel.prototype.init = function() {
    this.wrapper.classList.add('carouselWrapper');
    this.elWrapper.classList.add('carousel');
    this.wrapperWidth = this.wrapper.offsetWidth;

    if (this.loop) {
      this.clone(this.el[0], 'append');
      this.clone(this.el[this.lengthEl - 1], 'prepend');
    }

    this.setWidth();
  };

    this.endEvent();
  Carousel.prototype.setWidth = function() {
    for (let i = 0; i < this.lengthEl; i++) {
      if (this.slideView !== 1) {
        return;
      }
      this.el[i].style.cssText = 'width: ' + this.wrapperWidth + 'px;';
    }

    this.setWrapperWidth();
  };

  Carousel.prototype.setWrapperWidth = function() {
    this.updateLengthEl = this.loop ? this.lengthEl + 2 : this.lengthEl;
    this.transformX = this.loop ? -1 * this.wrapperWidth : 0;
    this.elWrapper.style.cssText = 'width: '+ this.wrapperWidth * this.updateLengthEl + 'px; transform: translateX(' + this.transformX + 'px);';
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
      this.indicatorEl[i].innerHTML = i + 1;
      this.indicatorEl[i].setAttribute('data-index', i);
      this.indicatorEl[0].classList.add('active');
    }

    this.appendCarousel(this.indicatorList);
  }

  Carousel.prototype.appendCarousel = function(el) {
    this.wrapper.appendChild(el);
  };

  Carousel.prototype.handlerControl = function() {
    this.moveTarget = event.target;
    this.targetData = this.moveTarget.dataset.direction;
    this.onMove(this.targetData);
  };

  Carousel.prototype.onMove = function(d) {
    if (d === 'prev') {
      this.index = this.index === 0 ? this.lengthEl : this.index - 1;
    } else {
      this.index = this.index === this.lengthEl + 1 ? 0 : this.index + 1;
    }

    this.onAnimate();
    this.onIndicator(this.index);
  };

  Carousel.prototype.onAnimate = function() {
    this.moveTransform = this.wrapperWidth * this.index * -1;
    this.elWrapper.style.transition = 'all .3s';
    this.elWrapper.style.transform = 'translateX(' + this.moveTransform + 'px)';

    if (this.index === this.lengthEl + 1) {
      this.onAnimateClone('last');
    }

    if (this.index === 0) {
      this.onAnimateClone('first');
    }
  };

  Carousel.prototype.onAnimateClone = function(state) {
    setTimeout(function () {
        this.elWrapper.style.transition = 'all 0s';
      if (state === 'last') {
        this.elWrapper.style.transform = 'translateX(' + this.wrapperWidth * -1 + 'px)';
        this.index = 1;
      } else {
        this.elWrapper.style.transform = 'translateX(' + this.wrapperWidth * this.lengthEl * -1 + 'px)';
        this.index = this.lengthEl;
      }
    }.bind(this), 300);
  };
  const domReady = () => {
    const carousel = new Carousel({
      wrapper: '.makeCarousel',
      endEvent: () => {
        console.log('move');
      }
    });
  };

  if (document.readyState === 'complete') {
    domReady();
  } else if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', domReady);
  }
})();