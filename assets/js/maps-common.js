/**
 * Core map functions, also builds context and trip maps.
 *
 * External vars expected (w/ example vals):
 *
 * Deploy config:
 * -------------
 * const POST_DIR = "/lib/";     // currently unused; for photo location data
 * const MAP_DATA_DIR = "/lib/"; // for country geojsons
 *
 * Core customization:
 * -------------------
 * const MAP_COUNTRY_NAME = "Georgia";
 * const MAP_THEME_COLOR = "#FF4136";
 * const MAP_CONTEXT_PADDING = 4.00;
 * const MAP_TRIP_PADDING = 0.05;
 * const MAP_TRIP_PLACES = [
 *     [41.714963, 44.828851, "Tbilisi", "right", "in"],
 *     [42.658347, 44.640784, "Kazbegi", "right", "in"],
 * ];
 *
 * Optional:
 * ---------
 * const MAP_ACTIVE_LIST = [""]; // for highlighting place on route (often unused)
 * const MAP_COUNTRY_EXTRA_NAME = null; // for an additional country
 * const MAP_COUNTRY_EXTRA_COLOR = null; // for an additional country color
 *
 * Neighbors (also optional):
 * const MAP_NEIGHBORS_LIST = [
 *     ["Russia", [44.190508, 44.189828], "top"],
 *     ["Georgia", [41.783452, 44.092452], "top"],
 *     ["Armenia", "auto", "top"],
 *     ["Iran", [37.565770, 46.501972], "top"],
 *     ["Turkey", [39.500450, 41.625810], "top"],
 *     ["Azerbaijan", "auto", "top"],
 * ];
 * const MAP_NEIGHBORS_BOUNDS = [
 *     [44.032123, 38.837827],
 *     [37.859427, 50.012896],
 * ];
 * const MAP_NEIGHBORS_END_TIMELINE_OFFSET = '-=2200';
 */

// Addl. globals
let allBoundaryData = {};

async function renderMap(elId) {
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
        let countrySlug = country.toLowerCase().replace(/ /gi, '-');
        if (allBoundaryData.hasOwnProperty(countrySlug)) {
            // console.log("Country", countrySlug, "already loaded. Skipping.")
            continue;
        }
        // console.log("Downloading " + countrySlug);
        let response = await fetch(MAP_DATA_DIR + "country-boundaries/" + countrySlug + ".geojson")
        let boundaryData = await response.json()
        // console.log(boundaryData['geometry']);
        allBoundaryData[countrySlug] = boundaryData;
    }
}

async function loadLocations(path) {
    const fullPath = POST_DIR + path;
    let response = await fetch(fullPath);
    return await response.json();
}

/**
 *
 * @param {*} places = [[lat, lon, label, tooltipDirection]]
 * tooltipDirection \in {right, left, top, bottom, center, auto}
 */
async function addPlaces(map, places, className) {
    // lines connecting places
    let coords = places.map((el) => [el[0], el[1], el[4]]);
    addLines(map, coords, "mapPath");

    // places
    for (let place of places) {
        // dots
        let coord = [place[0], place[1]];
        let name = place[2];
        let direction = place[3];
        let active = MAP_ACTIVE_LIST.indexOf(name) != -1;
        let circle = L.circle(coord, {
            color: 'white',
            // stroke: false,
            weight: 3,
            fillColor: MAP_THEME_COLOR,
            // fillColor: active ? '#FFF' : '#357EDD',
            fillOpacity: active ? 0.9 : 0.5,
            radius: 10000,
            className: className,
        }).addTo(map);

        // labels
        let hOffset = direction == "right" ? 10 : (direction == "left" ? -15 : 0);
        // let vOffset = direction == "bottom" ? 10 : (direction == "top" ? -10 : 0);
        // hack to get tooltip to line up with offset marker. couldn't get offsets in CSS to work,
        // but I should try to fix in future.
        // let hOffset = 10;
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

async function addLabel(map, label, location, direction) {
    let circle = L.circle(location, {
        stroke: false,
        fillOpacity: 0.0,
        radius: 0,
    }).addTo(map);
    circle.bindTooltip(label, {
        className: "mapTooltip sans-serif dn di-ns f6 f5-l",
        permanent: true,
        direction: direction,
        // offset: L.point(hOffset, vOffset),
        opacity: 0,
    }).openTooltip();
}

async function addLines(map, coords, className) {
    // thanks to https://stackoverflow.com/a/53507336
    for (let i = 0; i < coords.length - 1; i++) {
        let latlng1 = [coords[i][0], coords[i][1]];
        let bulge = coords[i][2];
        let latlng2 = [coords[i + 1][0], coords[i + 1][1]];

        // let latlng1 = [23.634501, -102.552783],
        //     latlng2 = [17.987557, -92.929147];

        let offsetX = latlng2[1] - latlng1[1],
            offsetY = latlng2[0] - latlng1[0];

        let r = Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2));
        let theta = Math.atan2(offsetY, offsetX);

        // orig: / 10; reduce to increase curvature (roughly)
        let thetaOffset = (3.1416 / 10);

        let r2 = (r / 2) / (Math.cos(thetaOffset));
        // orig: +; swap to - to reverse bulge direction.
        let theta2 = bulge == "in" ? theta + thetaOffset : theta - thetaOffset;

        let midpointX = (r2 * Math.cos(theta2)) + latlng1[1],
            midpointY = (r2 * Math.sin(theta2)) + latlng1[0];

        let midpointLatLng = [midpointY, midpointX];

        // latlngs.push(latlng1, midpointLatLng, latlng2);

        // console.log("Adding line");
        let curvedPath = L.curve(
            [
                'M', latlng1,
                'Q', midpointLatLng,
                latlng2
            ], {
            color: MAP_THEME_COLOR,
            // color: '#fff',
            weight: 10,
            className: className,
        }).addTo(map);
    }
}

async function renderOverlay(map, country, className, color, fillOpacity = null) {
    let countrySlug = country.toLowerCase().replace(/ /gi, '-');
    let boundaryData = allBoundaryData[countrySlug];
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

/**
 * Zoomed out map
 */
async function makeMapContext() {
    let mapContext = await renderMap("mapContext");
    let contextBoundary = await renderOverlay(mapContext, MAP_COUNTRY_NAME, "mapOutlineContext", MAP_THEME_COLOR);
    if (MAP_COUNTRY_EXTRA_NAME != null) {
        await renderOverlay(mapContext, MAP_COUNTRY_EXTRA_NAME, "mapOutlineContext", MAP_COUNTRY_EXTRA_COLOR);
    }
    let contextBounds = contextBoundary.getBounds().pad(MAP_CONTEXT_PADDING);  // probably need to adjust per country
    mapContext.fitBounds(contextBounds);

    anime({
        targets: '#mapContext .mapOutlineContext',
        easing: "easeInOutSine",
        direction: 'alternate', // Is not inherited
        loop: true, // Is not inherited
        duration: 1500,
        // delay: 1000,
        endDelay: 250,
        opacity: 0.9,
    });

    // `ResizeObserver` works better than `window.addEventListener('resize',
    // ...)`. I originally thought it was because events were being dropped, but
    // upon further inspection, they aren't. My hypothesis now is that the
    // events are firing before the map knows its new screen size, so the zoom
    // uses the old level.
    new ResizeObserver((_, __) => {
        mapContext.fitBounds(contextBounds);
    }).observe(document.getElementById("mapContext"));
}

/**
 * Traveling route
 */
async function makeMapTrip() {
    let mapTrip = await renderMap("mapTravel");
    let tripOverlay = await renderOverlay(mapTrip, MAP_COUNTRY_NAME, "mapOutlineTravel", MAP_THEME_COLOR);
    if (MAP_COUNTRY_EXTRA_NAME != null) {
        await renderOverlay(mapTrip, MAP_COUNTRY_EXTRA_NAME, "mapOutlineTravel", MAP_COUNTRY_EXTRA_COLOR);
    }
    let tripBounds = tripOverlay.getBounds().pad(MAP_TRIP_PADDING);
    mapTrip.fitBounds(tripBounds);
    // await addLocations(mapTrip, photos, "mapMarker");
    await addPlaces(mapTrip, MAP_TRIP_PLACES, "mapPlace");

    let tl = anime.timeline({
        // easing: 'linear',
        easing: 'spring(1, 80, 8, 30)',
        direction: 'alternate', // Is not inherited
        loop: true, // Is not inherited
    });
    tl.add({
        targets: '#mapTravel .mapOutlineTravel',
        translateX: -3,
        translateY: -7,
        // opacity: 1,
    }, "+=1000");
    tl.add({
        targets: '#mapTravel .mapPlace',
        translateX: -3,
        translateY: -7,
        opacity: 1,
        delay: anime.stagger(100, { start: 0 }),
    }, '-=1500');
    tl.add({
        targets: '#mapTravel .mapPath',
        opacity: 0.7,
        easing: 'easeInOutSine',
        duration: 250,
        strokeDashoffset: [anime.setDashoffset, 0],
        delay: anime.stagger(250, { start: 0 }),
    }, '-=2000');
    tl.add({
        easing: "easeOutExpo",
        targets: '#mapTravel .mapTooltip',
        // translating breaks tooltip locations when map changes (zoom, pan);
        // they stop tracking the spot they're supposed to stay. Annoying
        // because markers and outlines do reposition correctly while animating.
        opacity: 0.9,
        endDelay: 1500,
    }, '-=1500');

    new ResizeObserver((_, __) => {
        mapTrip.fitBounds(tripBounds);
    }).observe(document.getElementById("mapTravel"));
}

async function makeMapNeighbors() {
    // check whether we should run
    if (document.getElementById("mapNeighbors") == null ||
        typeof MAP_NEIGHBORS_LIST === "undefined" ||
        MAP_NEIGHBORS_LIST == null ||
        typeof MAP_NEIGHBORS_BOUNDS === "undefined" ||
        MAP_NEIGHBORS_BOUNDS == null ||
        typeof MAP_NEIGHBORS_END_TIMELINE_OFFSET === "undefined" ||
        MAP_NEIGHBORS_END_TIMELINE_OFFSET == null
    ) {
        return;
    }

    await loadBoundaries(MAP_NEIGHBORS_LIST.map((el) => el[0]));

    let mapNeighbors = await renderMap("mapNeighbors");
    let allColors = ["#FF4136", "#FF6300", "#FFD700", "#A463F2", "#FF80CC", "#19A974", "#357EDD"];
    let color = 0;
    let neighborOverlays = [];
    for (let i = 0; i < MAP_NEIGHBORS_LIST.length; i++) {
        let country = MAP_NEIGHBORS_LIST[i][0];
        let overlay = await renderOverlay(mapNeighbors, country, "mapOutlineNeighbors", allColors[color]);
        neighborOverlays.push(overlay);
        color = (color + 1) % allColors.length;
    }
    let neighborsBounds = L.latLngBounds(MAP_NEIGHBORS_BOUNDS);
    mapNeighbors.fitBounds(neighborsBounds);
    // NOTE: we need to add labels and stuff after the bounds, else leaflet freaks out.
    for (let i = 0; i < MAP_NEIGHBORS_LIST.length; i++) {
        await addLabel(
            mapNeighbors,
            MAP_NEIGHBORS_LIST[i][0],
            MAP_NEIGHBORS_LIST[i][1] == "auto" ? neighborOverlays[i].getBounds().getCenter() : MAP_NEIGHBORS_LIST[i][1],
            MAP_NEIGHBORS_LIST[i][2]
        );
    }

    let tl = anime.timeline({
        // easing: 'linear',
        easing: 'spring(1, 80, 8, 30)',
        direction: 'alternate', // Is not inherited
        loop: true, // Is not inherited
    });
    tl.add({
        targets: '#mapNeighbors .mapOutlineNeighbors',
        translateX: -3,
        translateY: -7,
        // opacity: 1,
        delay: anime.stagger(100, { start: 0 }),
    });
    tl.add({
        easing: "easeOutExpo",
        targets: '#mapNeighbors .mapTooltip',
        // translating breaks tooltip locations when map changes (zoom, pan);
        // they stop tracking the spot they're supposed to stay. Annoying because
        // markers and outlines do reposition correctly while animating.
        opacity: 0.9,
        delay: anime.stagger(100, { start: 0 }),
        endDelay: 1500,
    }, MAP_NEIGHBORS_END_TIMELINE_OFFSET);

    new ResizeObserver((_, __) => {
        mapNeighbors.fitBounds(neighborsBounds);
    }).observe(document.getElementById("mapNeighbors"));
}

// execution
async function main() {
    // Common setup
    let toLoad = [MAP_COUNTRY_NAME];
    if (MAP_COUNTRY_EXTRA_NAME != null) { toLoad.push(MAP_COUNTRY_EXTRA_NAME); }
    await loadBoundaries(toLoad);
    // const photos = await loadLocations("2022-scotland-photo-locations-shuffled.json");

    // Make maps
    await makeMapContext();
    await makeMapTrip();
    await makeMapNeighbors();
}

main();
