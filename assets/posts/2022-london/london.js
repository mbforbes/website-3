// External vars expected (w/ example vals):
// let libDir = "/lib/";
// let postDir = "/lib/";
// let activeList = ["London"];

// Addl. globals
let allBoundaryData = {};

async function renderMap(elId, maxZoom) {
    // remove any placeholder img
    for (let child of document.getElementById(elId).children) {
        // my stupid stylesheet overrules tachyon's display none (dn) with
        // my ":not(bare)" display definition, so adding bare and dn...
        child.classList.add("bare");
        child.classList.add("dn");
    }

    // replace "toner" here with "terrain" or "watercolor"
    let layer = new L.StamenTileLayer("toner-background", { detectRetina: true });
    let map = new L.Map(elId, {
        zoomSnap: 0.25,
        scrollWheelZoom: false,
        attributionControl: false,
        dragging: false,
        zoomControl: false,
    });
    map.addLayer(layer);

    // make base map lighter
    map.getPane("tilePane").style.opacity = .5;
    return map;
}

async function loadBoundaries(countries) {
    // country geojson attribution: https://datahub.io/core/geo-countries#data
    // Scotland, N-Ireland from: https://github.com/Crunch-io/geodata
    // England, Wales from https://martinjc.github.io/UK-GeoJSON/
    for (let country of countries) {
        let country_slug = country.toLowerCase().replace(' ', '-');
        // console.log("Downloading " + country_slug);
        let response = await fetch(libDir + "country-boundaries/" + country_slug + ".geojson")
        let boundaryData = await response.json()
        // console.log(boundaryData['geometry']);
        allBoundaryData[country_slug] = boundaryData;
    }
}

async function loadLocations(path) {
    const fullPath = postDir + path;
    let response = await fetch(fullPath);
    return await response.json();
}

/**
 *
 * @param {*} places = [[lat, lon, label, tooltipDirection]]
 * tooltipDirection \in {right, left, top, bottom, center, auto}
 */
async function addPlaces(map, places, className) {
    // places
    for (let place of places) {
        // dots
        let coord = [place[0], place[1]];
        let name = place[2];
        let direction = place[3];
        let active = activeList.indexOf(name) != -1;
        let circle = L.circle(coord, {
            color: 'white',
            // stroke: false,
            weight: 3,
            fillColor: '#FF4136',
            // fillColor: active ? '#FFF' : '#357EDD',
            fillOpacity: active ? 0.9 : 0.5,
            radius: 10000,
            className: className,
        }).addTo(map);

        // labels
        // let hOffset = direction == "right" ? 10 : (direction == "left" ? -10 : 0);
        // let vOffset = direction == "bottom" ? 10 : (direction == "top" ? -10 : 0);
        // hack to get tooltip to line up with offset marker. couldn't get offsets in CSS to work,
        // but I should try to fix in future.
        let hOffset = 10;
        let vOffset = -7;
        circle.bindTooltip(name, {
            // className: className + " sans-serif f6 f5-ns" + (active ? " mapPlaceActive" : ""),
            className: "mapTooltip sans-serif f6 f5-l" + (active ? " mapPlaceActive" : ""),
            permanent: true,
            direction: direction,
            offset: L.point(hOffset, vOffset),
            opacity: 0,
        }).openTooltip();
    }

}

async function renderOverlay(map, country, className, color, fillOpacity = null) {
    let country_slug = country.toLowerCase().replace(' ', '-');
    let boundaryData = allBoundaryData[country_slug];
    let boundary = L.geoJSON(boundaryData, {
        style: {
            // stroke
            // stroke: false,
            color: color, // NOTE: may want white outline for blur...
            weight: 1,  // stroke width
            // opacity: 0.4,
            // fill
            fillColor: color,
            fillOpacity: fillOpacity || 0.4,
            className: className,
        }
    }).addTo(map);
    return boundary;
}

// execution
async function main() {
    await loadBoundaries(['England']);
    // const photos = await loadLocations("2022-scotland-photo-locations-shuffled.json");
    const places = [
        [51.505306, -0.113189, "London", "right", "in"],
    ];

    // mapContext: zoomed out
    // ---
    let mapContext = await renderMap("mapContext", 4.0);
    let contextBoundary = await renderOverlay(mapContext, 'England', "mapOutlineContext", "#FF4136", 0.6);
    let contextBounds = contextBoundary.getBounds().pad(2.0);  // probably need to adjust per country
    mapContext.fitBounds(contextBounds);
    {
        anime({
            targets: '.mapOutlineContext',
            easing: "easeInOutSine",
            direction: 'alternate', // Is not inherited
            loop: true, // Is not inherited
            duration: 1500,
            // delay: 1000,
            endDelay: 250,
            opacity: 0.7,
        });
    }

    // mapTrip: the traveling route
    // ---
    let mapTrip = await renderMap("mapTravel", undefined);
    let tripOverlay = await renderOverlay(mapTrip, 'England', "mapOutlineTravel", "#FF4136");
    let tripBounds = tripOverlay.getBounds().pad(0.1);  // probably good universally
    mapTrip.fitBounds(tripBounds);
    // await addLocations(mapTrip, photos, "mapMarker");
    await addPlaces(mapTrip, places, "mapPlace");

    let tl = anime.timeline({
        // easing: 'linear',
        easing: 'spring(1, 80, 8, 30)',
        direction: 'alternate', // Is not inherited
        loop: true // Is not inherited
    });
    tl.add({
        targets: '.mapOutlineTravel',
        translateX: -3,
        translateY: -7,
        // opacity: 1,
    }, "+=1000");
    tl.add({
        targets: '.mapPlace',
        translateX: -3,
        translateY: -7,
        opacity: 1,
        delay: anime.stagger(100, { start: 0 }),
    }, '-=1500');
    tl.add({
        easing: "easeOutExpo",
        targets: '.mapTooltip',
        // translating breaks tooltip locations when map changes (zoom, pan);
        // they stop tracking the spot they're supposed to stay. Annoying because
        // markers and outlines do reposition correctly while animating.
        opacity: 0.9,
    }, '-=1500');

    // `ResizeObserver1 works better than `window.addEventListener('resize', ...)`.
    // I originally thought it was because events were being dropped, but upon further
    // inspection, they aren't. My hypothesis now is that the events are firing before
    // the map knows its new screen size, so the zoom uses the old level.
    new ResizeObserver((_, __) => {
        mapTrip.fitBounds(tripBounds);
    }).observe(document.getElementById("mapTravel"));
    new ResizeObserver((_, __) => {
        // console.log("ResizeObserver: context");
        mapContext.fitBounds(contextBounds);
    }).observe(document.getElementById("mapContext"));
}

main();
