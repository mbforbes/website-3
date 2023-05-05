const cards = document.querySelectorAll('.card');
// console.log(cards);
let bounds;
let lastX = -1;
let lastY = -1;

function rotateToMouse(card, e) {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // filter same coords to do less work
    if (mouseX == lastX && lastY == mouseY) {
        // console.log("Skipping");
        return;
    }
    lastX = mouseX;
    lastY = mouseY;
    // console.log(e);

    const leftX = mouseX - bounds.x;
    const topY = mouseY - bounds.y;
    const center = {
        x: leftX - bounds.width / 2,
        y: topY - bounds.height / 2
    }
    const distance = Math.sqrt(center.x ** 2 + center.y ** 2);

    card.style.transform = `
    scale3d(1.07, 1.07, 1.07)
    rotate3d(
      ${center.y / 100},
      ${-center.x / 100},
      0,
      ${Math.log(distance) * 2}deg
    )
  `;

    card.querySelector('.glow').style.backgroundImage = `
    radial-gradient(
      circle at
      ${center.x * 2 + bounds.width / 2}px
      ${center.y * 2 + bounds.height / 2}px,
      #ffffff22,
      #0000000f
    )
  `;
}

cards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
        // console.log("Adding")
        bounds = card.getBoundingClientRect();
        card.addEventListener('mousemove', rotateToMouse.bind(null, card));
    });

    card.addEventListener('mouseleave', () => {
        // console.log("Removing")
        card.removeEventListener('mousemove', rotateToMouse.bind(null, card));
        card.style.transform = '';
        // card.style.background = '';
    });
})
