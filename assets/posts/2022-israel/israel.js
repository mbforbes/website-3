// External vars expected (w/ example vals):
// let libDir = "/lib/";
// let postDir = "/lib/";
// let activeList = [""];

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
        let country_slug = country.toLowerCase().replace(/ /gi, '-');
        // console.log(country_slug);
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
    // lines connecting places
    let coords = places.map((el) => [el[0], el[1], el[4]]);
    addLines(map, coords, "mapPath");

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
            fillColor: '#357EDD',
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
            color: '#fff',
            // color: '#fff',
            weight: 10,
            className: className,
        }).addTo(map);
    }
}

async function renderOverlay(map, country, className, color, fillOpacity = null) {
    let country_slug = country.toLowerCase().replace(/ /gi, '-');
    let boundaryData = allBoundaryData[country_slug];
    if (boundaryData == null) {
        throw Error("Couldn't find boundary data for '" + country_slug + "'");
    }
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
    let neighbors = [
        ["Spain", [40.450525, -1.849750], "left"],
        ["France", [45.470435, 2.950101], "bottom"],
        ["Italy", "auto", "left"],
        ["Malta", "auto", "bottom"],
        ["Slovenia", "auto", "top"],
        ["Croatia", [44.900480, 13.931407], "left"],
        ["Bosnia and Herzegovina", [44.758474, 17.867489], "right"],
        ["Montenegro", [42.864174, 19.212634], "left"],
        ["Albania", "auto", "right"],
        ["Greece", "auto", "bottom"],
        ["Turkey", "auto", "left"],
        ["Cyprus", "auto", "left"],
        ["Northern Cyprus", "auto", "top"],
        ["Syria", "auto", "top"],
        ["Lebanon", "auto", "right"],
        ["Israel", "auto", "left"],
        ["Palestine", "auto", "right"],
        ["Egypt", "auto", "top"],
        ["Libya", "auto", "top"],
        ["Tunisia", "auto", "left"],
        ["Algeria", "auto", "top"],
        ["Morocco", [31.851849, -6.272384], "left"],
    ];
    await loadBoundaries(neighbors.map((el) => el[0]));
    // const photos = await loadLocations("2022-scotland-photo-locations-shuffled.json");
    const places = [
        [31.7833, 35.2167, "Jerusalem", "right", "in"],
        [32.0800, 34.7800, "Tel Aviv", "left", "in"],
        [32.8000, 34.9833, "Haifa", "right", "in"],
    ];

    // mapContext: zoomed out
    // ---
    let mapContext = await renderMap("mapContext");
    let contextBoundary = await renderOverlay(mapContext, 'Israel', "mapOutlineContext", "#357EDD");
    let contextBoundary2 = await renderOverlay(mapContext, 'Palestine', "mapOutlineContext", "#19A974");
    let contextBounds = contextBoundary.getBounds().pad(2.50);  // probably need to adjust per country
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
            opacity: 0.9,
        });
    }

    // mapTrip: the traveling route
    // ---
    let mapTrip = await renderMap("mapTravel");
    let tripOverlay = await renderOverlay(mapTrip, 'Israel', "mapOutlineTravel", "#357EDD");
    let tripOverlay2 = await renderOverlay(mapTrip, 'Palestine', "mapOutlineTravel", "#19A974");
    let tripBounds = tripOverlay.getBounds().pad(-0.10);  // probably good universally (edit: wasn't lol. was 0.05)
    mapTrip.fitBounds(tripBounds);
    // await addLocations(mapTrip, photos, "mapMarker");
    await addPlaces(mapTrip, places, "mapPlace");
    {
        let tl = anime.timeline({
            // easing: 'linear',
            easing: 'spring(1, 80, 8, 30)',
            direction: 'alternate', // Is not inherited
            loop: true, // Is not inherited
        });
        tl.add({
            targets: '.mapOutlineTravel',
            translateX: -3,
            translateY: -7,
            // opacity: 1,
            delay: anime.stagger(100, { start: 0 }),
        }, "+=1000");
        tl.add({
            targets: '.mapPlace',
            translateX: -3,
            translateY: -7,
            opacity: 1,
            delay: anime.stagger(100, { start: 0 }),
        }, '-=1500');
        tl.add({
            targets: '.mapPath',
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
            // they stop tracking the spot they're supposed to stay. Annoying because
            // markers and outlines do reposition correctly while animating.
            delay: anime.stagger(100, { start: 0 }),
            opacity: 0.9,
            endDelay: 1500,
        }, '-=1500');
    }

    // mapNeighbors: mediterranean context.
    let mapNeighbors = await renderMap("mapNeighbors");
    // let neighborsOverlay = await renderOverlay(mapNeighbors, 'Israel', "mapOutlineNeighbors", "#357EDD");
    // let neighborsOverlay2 = await renderOverlay(mapNeighbors, 'Palestine', "mapOutlineNeighbors", "#19A974");
    let allColors = ["#FF4136", "#FF6300", "#FFD700", "#A463F2", "#FF80CC", "#19A974", "#357EDD"];
    let color = 0;
    let neighborOverlays = []
    for (let i = 0; i < neighbors.length; i++) {
        let country = neighbors[i][0];
        let overlay = await renderOverlay(mapNeighbors, country, "mapOutlineNeighbors", allColors[color]);
        neighborOverlays.push(overlay);
        // console.log(overlay.getBounds().getCenter());
        color = (color + 1) % allColors.length;
    }
    let neighborsBounds = L.latLngBounds([
        [32.173904, -11.762316],
        [42.677251, 40.897252],
    ]);
    mapNeighbors.fitBounds(neighborsBounds);
    // NOTE: we need to add labels and stuff after the bounds, else leaflet freaks out.
    for (let i = 0; i < neighbors.length; i++) {
        await addLabel(
            mapNeighbors,
            neighbors[i][0],
            neighbors[i][1] == "auto" ? neighborOverlays[i].getBounds().getCenter() : neighbors[i][1],
            neighbors[i][2]
        );
    }

    {
        let tl = anime.timeline({
            // easing: 'linear',
            easing: 'spring(1, 80, 8, 30)',
            direction: 'alternate', // Is not inherited
            loop: true, // Is not inherited
        });
        tl.add({
            targets: '.mapOutlineNeighbors',
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
        }, '-=4200');
    }

    // `ResizeObserver1 works better than `window.addEventListener('resize', ...)`.
    // I originally thought it was because events were being dropped, but upon further
    // inspection, they aren't. My hypothesis now is that the events are firing before
    // the map knows its new screen size, so the zoom uses the old level.
    new ResizeObserver((_, __) => {
        mapTrip.fitBounds(tripBounds);
    }).observe(document.getElementById("mapTravel"));
    new ResizeObserver((_, __) => {
        mapContext.fitBounds(contextBounds);
    }).observe(document.getElementById("mapContext"));
    new ResizeObserver((_, __) => {
        mapNeighbors.fitBounds(neighborsBounds);
    }).observe(document.getElementById("mapNeighbors"));
}

document.addEventListener("DOMContentLoaded", function () {
    main();
});
