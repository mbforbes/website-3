//
// This script lazily sets the background-image style of <div> who will have
// blurred backgrounds of the images inside them. We do this manually because
// browsers don't natively support lazy loading background-images the way they
// do for <img loading="lazy">. Info: https://web.dev/lazy-loading-images/. The
// reason we want to lazily set them is, if we don't, the browser will
// immediately fetch them on page load, defeating our attempts at lazily loading
// them. We need to do this because so many images in the collections have
// blurred backgrounds.
//

let lazyBGs = [].slice.call(document.querySelectorAll(".svgBlur"));
if ("IntersectionObserver" in window) {
    let lazyBGObserver = new IntersectionObserver((elements, _observer) => {
        elements.forEach((el) => {
            if (el.isIntersecting && el.target.hasAttribute("data-background-image")) {
                // replace the background-image style with the contents of the data-background-image attribute
                el.target.style.backgroundImage = el.target.getAttribute('data-background-image');
                lazyBGObserver.unobserve(el.target);
            }
        });
    });

    lazyBGs.forEach((lazyBG) => {
        lazyBGObserver.observe(lazyBG);
    });
}
