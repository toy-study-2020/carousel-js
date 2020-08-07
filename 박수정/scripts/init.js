window.onload = function () {
    const option = {
        navigation: true,
        pagination: true,
        autoPlay: true,
        controlPlay: true,
        timer: 1000,
        transitionSpeed: 100
    }
    // const sliderTest = new slider('.user-slider');
    const sliderTest = new slider('.user-slider', option);
    sliderTest.init();
}