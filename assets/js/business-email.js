// exponential easing, shoutout https://www.s-ings.com/scratchpad/exponential-easing/
const easeInOut = (t, p = 5) =>
  t <= 0.5 ? Math.pow(t * 2, p) / 2 : 1 - Math.pow(2 - t * 2, p) / 2;

// NOTE: For further improvement: Right now I want to adjust the CSS animation
// timing dynamically to match when the next element arrives. Haven't thought
// deeply, but inventory of tools include:
// - we can invert the tween function
// - we can sample the points in advance

const getItem = (choices, portion) => {
  return choices[Math.round(easeInOut(portion) * (choices.length - 1))];
};

const computeTimes = (charSet, totalTms, deltaTms) => {
  const durations = new Map();
  const choices = charSet.slice(0, -1);
  const finalItem = charSet[charSet.length - 1];
  let curStartT = 0;
  let curItem = choices[0];
  for (let t = 0; t <= totalTms; t += deltaTms) {
    const portion = t / totalTms;
    const nextItem = getItem(choices, portion);
    console.log("t", t, nextItem);
    if (nextItem != curItem) {
      durations.set(curItem, t - curStartT);
      curStartT = t;
      curItem = nextItem;
    }
  }
  // add final item
  durations.set(choices[choices.length - 1], totalTms - curStartT);

  const valsAndDurations = [];
  for (let choice of choices) {
    if (!durations.has(choice)) {
      continue;
    }
    valsAndDurations.push([choice, durations.get(choice)]);
  }
  valsAndDurations.push([finalItem, -1]); // simply land on last, so -1 (no "duration")
  return valsAndDurations;
};

// shoutout: https://jsfiddle.net/tj8nrrcf/
const tweenCharacter = (slotID, startCharCode, endCharCode, startDelayMs) => {
  const totalTms = 3000;
  const deltaTms = 60;
  // const start = Date.now();
  // const slotID = "slot-0";
  // const curElID = "slot-0-cur";
  // const nextElID = "slot-0-next";
  // eventually, could even consider set char array or weird char codes to get interesting
  // stuff in there (other langs, etc.)
  // const startCharCode = 100;
  // const finalCharCode = 120;
  // go to one before final, because, big mass of tween ends up on last element
  const n =
    (endCharCode > startCharCode
      ? endCharCode - startCharCode
      : startCharCode - endCharCode) + 1;
  const dir = endCharCode > startCharCode ? 1 : -1;
  const charSet = Array(n)
    .fill(0)
    .map((v, i) => startCharCode + i * dir);
  // let scrollCharCode = choices[0];

  const valsAndDurations = computeTimes(charSet, totalTms, deltaTms);
  // const valsAndDurations = [
  //     [100, 500],
  //     [101, 3000],
  //     [102, -1],
  // ];
  console.log(valsAndDurations);

  // if we're sampling regularly, don't need timeouts then, right? just an interval?
  // const n = (totalTms / deltaTms) + 1; // (+1 for 0)
  // const timeouts = Array(n).fill(0).map((v, i) => i * deltaTms);
  // console.log(timeouts);

  const slot = document.getElementById(slotID);
  let index = 0;

  // NOTE: I was sure there was an off-by-one bug here about cur / landCharCode
  // / CSS transition time / wait time. I never updated this comment so not sure
  // whether I fixed.
  const f = () => {
    const [scrollCharCode, timeToNext] = valsAndDurations[index];
    const [landCharCode, _] = valsAndDurations[index + 1];
    slot.innerHTML =
      `<div class="slotItem scrollMe" style="animation-duration: ${
        timeToNext / 1000
      }s">` +
      String.fromCharCode(scrollCharCode) +
      "</div>" +
      '<div class="slotItem">' +
      String.fromCharCode(landCharCode) +
      "</div>";

    // advance and schedule next
    // scrollCharCode = landCharCode;
    index += 1;
    if (index < valsAndDurations.length - 1) {
      setTimeout(f, timeToNext);
    }
  };
  // setTimeout(f, valsAndDurations[0][1]);
  setTimeout(f, startDelayMs); // any pause before starting set here
  // setTimeout(() => {
  //     index += 1;
  // }, valsAndDurations[index][1]);

  // const iid = setInterval(() => {
  //     // console.log("running");

  //     // Surprisingly to me, you can reference iid in here! And even vars defined after.
  //     const portion = (Date.now() - start) / totalTms;
  //     let setTo = curCharCode;
  //     if (portion >= 1.0) {
  //         setTo = choices[choices.length - 1];
  //         clearInterval(iid);
  //     } else {
  //         setTo = getItem(choices, portion);
  //         // setTo = Math.round(startCharCode + easeInOut(portion) * (finalCharCode - startCharCode));
  //     }
  //     // CSS animation runs whenever set, even if set to same thing! So only set if changed.
  //     if (curCharCode != setTo) {
  //         // let animDuration = setTo == finalCharCode ? "1.0" : "0.3";  // TODO: replace with full adaptive timing.
  //         let animDuration = "0.3";
  //         console.log("setTo:", setTo);
  //         // document.getElementById(curElID).innerText = String.fromCharCode(setTo);
  //         // document.getElementById(nextElID).innerText = String.fromCharCode(setTo + 1);
  //         slot.innerHTML = (
  //             `<div class="slotItem scrollMe" style="animation-duration: ${animDuration}s">`+String.fromCharCode(curCharCode)+'</div>'+
  //             '<div class="slotItem">'+(String.fromCharCode(setTo))+'</div>'
  //         );
  //         // slot.

  //         curCharCode = setTo;
  //     }
  // }, deltaTms);
};

const targetCodes = [0x6d, 0x61, 0x78, 0x40, 0x6c, 0x73, 0x62, 0x2e, 0x6c, 0x6c, 0x63];
const baseDelayMs = 700; // time before first starts
const totalStaggerMs = 1500; // time between first ending and last ending
const tweens = [];
const baseBuf = [];
for (let i = 0; i < targetCodes.length; i++) {
  baseBuf.push(
    `<div class="slot" id="slot-${i}">${i == targetCodes.length - 1 ? "1" : "0"}</div>`
  );
  // schedule tweens until all elements built
  tweens.push(() => {
    tweenCharacter(
      `slot-${i}`,
      i == targetCodes.length - 1 ? 0x31 : 0x30,
      targetCodes[i],
      baseDelayMs + totalStaggerMs * easeInOut(i / (targetCodes.length - 1), 1)
    );
  });
}
document.getElementById("business-email").innerHTML = baseBuf.join("\n");
// kick off tweens
for (let tween of tweens) {
  tween();
}

// for (i = 0; i <= 1; i+= 0.1) {
//     console.log(i, easeInOut(i));
// }
