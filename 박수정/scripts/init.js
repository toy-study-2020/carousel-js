window.onload = function () {
    const option = {
        navigation: true,
        pagination: true,
        controlPlay: true,
        autoPlay: false,
        timer: 2000,
        transitionSpeed: 100
    }

    // const sliderTest = new Slider('.user-slider');
    const sliderTest = new Slider('.user-slider', option);
    sliderTest.init();
}