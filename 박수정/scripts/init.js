window.onload = function () {
    const option = {
        navigation: true,
        pagination: true,
        autoPlay: true,
        controlPlay: true,
        timer: 1000,
        transitionSpeed: 200
    }

    // const sliderTest = new Slider('.user-slider');
    const sliderTest = new Slider('.user-slider', option);
    sliderTest.init();
}