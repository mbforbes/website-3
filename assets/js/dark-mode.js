/**
 * Logic:
 * (1) page load
 *   - if manual pref storage is set (light, dark, vaporwave), respect that
 *   - else, if matchMedia() set to dark, do that
 *   - else, light mode
 *
 * (2) setting pref
 *   - if new pref is same as matchMedia(), then clear storage.
 *   - if new pref differs from matchMedia(), set in storage.
 *   - Always set new pref. (Just call (1))
 */

const allowedSchemes = ['light', 'dark', 'vaporwave'];
let curScheme = null;

// theme (str) can be 'dark' or 'light'
function systemWants(theme) {
    return window.matchMedia != null && window.matchMedia('(prefers-color-scheme: ' + theme + ')').matches;
}

function setColorScheme() {
    // default is light
    let desired = "light";

    // if manual pref storage is set (light, dark, vaporwave), respect that
    let userPref = window.localStorage.getItem('color-scheme');
    if (userPref != null && allowedSchemes.indexOf(userPref) != -1) {
        desired = userPref;
    } else if (systemWants("dark")) {
        // or, if matchMedia() set to dark, do that
        desired = "dark";
    }

    curScheme = desired;
    document.documentElement.setAttribute('data-theme', curScheme);

    // NOTE: The display indicator is updated in CSS
}

// click to move along states
function manualColorSchemeClick() {
    // figure out next color in sequence
    let curIndex = allowedSchemes.indexOf(curScheme);
    if (curIndex == -1) {
        console.error("Bad current color scheme:", curScheme);
        return;
    }
    // trigger logic that says user has picked that one
    let newScheme = allowedSchemes[(curIndex + 1) % allowedSchemes.length];

    let systemLight = systemWants("light");
    let systemDark = systemWants("dark");

    // if new pref is same as matchMedia(), then clear storage.
    if ((newScheme == "light" && systemLight) || (newScheme == "dark" && systemDark)) {
        window.localStorage.removeItem('color-scheme');
    } else {
        // if new pref differs from matchMedia(), set in storage.
        window.localStorage.setItem("color-scheme", newScheme);
    }

    // always set new scheme
    setColorScheme();
}

// Listener for when system color scheme changed. Call logic again.
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    setColorScheme();
});

// Set scheme on page load.
setColorScheme();
