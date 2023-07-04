// Portion of layout code running right on page load to attempt to avoid visual
// swapping. We also define all layouts here; if updating, also update CSS.

// settings

/**
 * Each entry is [layoutElID, buttonElID, layout name, activationCode]
 */
const layoutData = [
    ["list-category-layout", "layout-button-list", "List layout", 'unflipCards()'],
    ["card-layout", "layout-button-card", "Card layout", 'flipCards()'],
]
const layoutKey = "layout";
// const allLayouts = layoutData.reduce((acc, curr) => (acc.push(curr[0]), acc), []);
const allLayouts = ["list-category-layout", "card-layout"];

// compute desired
let startLayout = layoutData[0][0];
let userPrefLayout = window.localStorage.getItem(layoutKey);
if (userPrefLayout != null && allLayouts.indexOf(userPrefLayout) != -1) {
    startLayout = userPrefLayout;
}

// NOTE: This is the only action we take, so it's repeated here and in
// layout-switching. if there ends up being more, make a function that both can
// call.
document.documentElement.setAttribute('data-layout', startLayout);
