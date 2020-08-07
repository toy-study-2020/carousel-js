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