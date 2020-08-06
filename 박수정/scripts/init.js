window.onload = function () {
    const option = {
        navigation: true,
        pagination: true,
        autoPlay: true
    }
    // const sliderTest = new slider('.user-slider');
    const sliderTest = new slider('.user-slider', option);
    sliderTest.init();
}