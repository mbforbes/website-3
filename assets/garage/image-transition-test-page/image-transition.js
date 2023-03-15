//
// Prototype for script to fade-transition layered images. Used for progressively
// revealing map layers.
//

let containers = document.getElementsByClassName("imageContainer");
for (let container of containers) {
    let images = container.children;
    let n = images.length;
    let endTicks = 3;
    let cur = n - 1;
    let curTicks = endTicks;
    setInterval(() => {
        if (cur == n - 1) {
            curTicks--;
            if (curTicks == 0) {
                for (let image of images) {
                    image.classList.remove("o-1");
                    image.classList.add("o-0");
                }
                images[0].classList.remove("o-0");
                images[0].classList.add("o-1");
                cur = 0;
                curTicks = endTicks;
            }
        } else {
            next = cur + 1;
            images[next].classList.remove("o-0");
            images[next].classList.add("o-1");
            cur = next;
        }
    }, 1000);
}
