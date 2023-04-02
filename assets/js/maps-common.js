/**
 * Core map functions, also builds context and trip maps.
 *
 * Config expected (w/ example vals):
 *
 * const MAP_CONFIG = {
 *       core: {
 *           mapDataDir: "/lib/",
 *       },
 *       // Settings common to context and travel maps
 *       subjectCountries: [
 *           { name: "Georgia", "color": "#FF4136" },
 *       ],
 *       context: {
 *           padding: 4.00,
 *       },
 *       trip: {
 *           padding: 0.05,
 *           places: [
 *               [41.714963, 44.828851, "Tbilisi", "right", "in"],
 *               [42.658347, 44.640784, "Kazbegi", "right", "in"],
 *           ],
 *           placeColor: "#FF4136",
 *           active: ["Tbilisi"],
 *           activeTooltipColor: "red",
 *           locationsPath: null, // unused
 *       },
 *       neighborsMaps: [
 *           {
 *               elID: "mapNeighbors",  // default
 *               countries: [
 *                   ["Russia", [44.190508, 44.189828], "top"],
 *                   ["Georgia", [41.783452, 44.092452], "top"],
 *                   ["Armenia", "auto", "top"],
 *                   ["Iran", [37.565770, 46.501972], "top"],
 *                   ["Turkey", [39.500450, 41.625810], "top"],
 *                   ["Azerbaijan", "auto", "top"],
 *               ],
 *               countryColors: ["#FF4136", ...], // optional
 *               animateCountries: true, // default
 *               bounds: [
 *                   [44.032123, 38.837827],
 *                   [37.859427, 50.012896],
 *               ],
 *               endTimelineOffset: '-=2200',
 *           },
 *           {
 *               elID: "mapRussiaExits",  // default
 *               countries: [
 *                   ["Russia", [58.643898, 65.084873], "top"],
 *                   ["Kazakhstan", "auto", "top"],
 *                   ["Georgia", "auto", "bottom"],
 *                   ["Mongolia", "auto", "top"],
 *               ],
 *               places: [
 *                   [55.756006, 37.620606, "Moscow", "right", "in"],
 *               ],
 *               drawPlaceLine: false, // default
 *               placeCircleRadius: 50000, // default
 *               placeColor: "#000",
 *               bounds: [
 *                   [56.364228, 27.309065],
 *                   [43.638917, 121.946686],
 *               ],
 *               endTimelineOffset: '-=2200',
 *           },
 *       ]
 *   };
 */

// Addl. globals
let allBoundaryData = {};

async function renderMap(elID) {
    let mapEL = document.getElementById(elID);
    if (mapEL == null) {
        throw new Error("Couldn't find element with ID " + elID);
    }

    // remove any placeholder img
    for (let child of mapEL.children) {
        // my stupid stylesheet overrules tachyon's display none (dn) with
        // my ":not(bare)" display definition, so adding bare and dn...
        child.classList.add("bare");
        child.classList.add("dn");
    }

    // replace "toner" here with "terrain" or "watercolor"
    let layer = new L.StamenTileLayer("toner-background", { detectRetina: true });
    let map = new L.Map(elID, {
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

async function loadBoundaries(dataDir, countries) {
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
        let response = await fetch(dataDir + "country-boundaries/" + countrySlug + ".geojson")
        let boundaryData = await response.json()
        // console.log(boundaryData['geometry']);
        allBoundaryData[countrySlug] = boundaryData;
    }
}

async function loadLocations(path) {
    let response = await fetch(path);
    return await response.json();
}

/**
 *
 * @param {L.map}
 * @param {[number, number, string, string, string]} places
 *  looks like[[lat, lon, label, tooltipDirection, curveDirection]]
 *  and tooltipDirection \in {right, left, top, bottom, center, auto}
 * @param {string} fillColor
 * @param {boolean} doLines
 * @param {string[]} activeList
 * @param {*} extraConfig
 */
async function addPlaces(map, places, fillColor, doLines, activeList, extraConfig = {}) {
    if (doLines) {
        let coords = places.map((el) => [el[0], el[1], el[4]]);
        addLines(map, coords, fillColor, "mapPath");
    }

    let tooltipSmall = extraConfig.tooltipSmall || false;
    let tooltipExtraClasses = extraConfig.tooltipExtraClasses || "";
    let circleRadius = extraConfig.circleRadius || 10000;
    let activeTooltipColor = extraConfig.activeTooltipColor; // could be undefined

    let activeTooltipClasses = activeTooltipColor != null ? `white bg-${activeTooltipColor}` : "";

    // places
    let placeNames = places.map((el) => el[2]);
    // console.log(placeNames)
    for (let i = 0; i < places.length; i++) {
        let place = places[i];
        let coord = [place[0], place[1]];
        let name = place[2];
        let direction = place[3];

        // skip adding dot / label for place twice. (this happens if traveling
        // to places multiple times and want to show this route)
        if (placeNames.indexOf(name) < i) {
            // console.log("Skipping adding", name, "again.")
            continue;
        }

        // dots
        let active = activeList.indexOf(name) != -1;
        let circle = L.circle(coord, {
            color: 'white',
            // stroke: false,
            weight: 3,
            fillColor: active ? '#FFF' : fillColor,
            fillOpacity: active ? 0.9 : 0.5,
            radius: circleRadius,
            className: "mapPlace",
        }).addTo(map);

        // labels
        let hOffset = direction == "right" ? 10 : (direction == "left" ? -15 : (direction == "top" ? -3 : 0));
        // let vOffset = direction == "bottom" ? 10 : (direction == "top" ? -10 : 0);
        // hack to get tooltip to line up with offset marker. couldn't get offsets in CSS to work,
        // but I should try to fix in future.
        // let hOffset = 10;
        let vOffset = direction == "top" ? -19 : -7;
        let tooltipFont = tooltipSmall ? "f7" : "f6 f5-l";
        let curActiveTooltipClasses = active ? activeTooltipClasses : "";
        circle.bindTooltip(name, {
            className: `mapTooltip sans-serif ${tooltipFont} ${tooltipExtraClasses} ${curActiveTooltipClasses}`,
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

async function addLines(map, coords, lineColor, className) {
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
            color: lineColor,
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
 *
 * @param {L.Map} map L.Map
 * @param {{name: str, color: str}[]} countryInfos list of countr
 * @param {string} className
 * @param {number} pad
 * @returns {L.LatLngBounds}
 */
async function renderOverlays(map, countryInfos, className, pad) {
    let bounds = null;
    for (let ci of countryInfos) {
        let boundary = await renderOverlay(map, ci.name, className, ci.color);
        if (bounds == null) {
            bounds = boundary.getBounds();
        } else {
            bounds.extend(boundary.getBounds());
        }
    }
    return bounds.pad(pad);
}

/**
 * Zoomed out map
 */
async function makeMapContext() {
    let mapContext = await renderMap("mapContext");

    // make bounds that covers all the desired areas.
    let contextBounds = await renderOverlays(
        mapContext,
        MAP_CONFIG.subjectCountries,
        "mapOutlineContext",
        MAP_CONFIG.context.padding
    );
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
 * Trip: the traveling route.
 */
async function makeMapTrip() {
    let elID = "mapTrip";
    let mapTrip = await renderMap(elID);

    // make bounds that covers all the desired areas.
    let tripBounds = await renderOverlays(
        mapTrip,
        MAP_CONFIG.subjectCountries,
        "mapOutlineTrip",
        MAP_CONFIG.trip.padding
    );
    mapTrip.fitBounds(tripBounds);

    // minor (photo) locations unimplemented
    // await addLocations(mapTrip, photos, "mapMarker");

    // add trip stops and lines between them
    await addPlaces(
        mapTrip,
        MAP_CONFIG.trip.places,
        MAP_CONFIG.trip.placeColor,
        true,  // add lines
        MAP_CONFIG.trip.active || [],
        {
            activeTooltipColor: MAP_CONFIG.trip.activeTooltipColor,
        }
    );

    let tl = anime.timeline({
        // easing: 'linear',
        easing: 'spring(1, 80, 8, 30)',
        direction: 'alternate', // Is not inherited
        loop: true, // Is not inherited
    });
    // TODO: offsets (e.g. "-=3000") should probably be calculated based on the
    // number of places. Right now the timing is different for 3 vs 4 vs 5-place
    // maps.
    tl.add({
        targets: `#${elID} .mapOutlineTrip`,
        translateX: -3,
        translateY: -7,
        // opacity: 1,
    }, "+=250");
    tl.add({
        targets: `#${elID} .mapPlace`,
        translateX: -3,
        translateY: -7,
        opacity: 1,
        delay: anime.stagger(400, { start: 0 }),
    }, '-=1500');
    tl.add({
        targets: `#${elID} .mapPath`,
        opacity: 0.7,
        easing: 'easeInOutSine',
        duration: 250,
        strokeDashoffset: [anime.setDashoffset, 0],
        delay: anime.stagger(400, { start: 0 }),
    }, '-=3000');
    tl.add({
        easing: "easeOutExpo",
        targets: `#${elID} .mapTooltip`,
        // translating breaks tooltip locations when map changes (zoom, pan);
        // they stop tracking the spot they're supposed to stay. Annoying
        // because markers and outlines do reposition correctly while animating.
        delay: anime.stagger(400, { start: 0 }),
        opacity: 0.9,
        endDelay: 1500,
    }, '-=3000');

    new ResizeObserver((_, __) => {
        mapTrip.fitBounds(tripBounds);
    }).observe(document.getElementById(elID));
}

async function makeMapNeighbors(mapDataDir, nMap) {
    let elID = nMap.elID || "mapNeighbors"; // default element ID

    // We'd check for this in renderMap(), but it throws an error. This is fine
    // if we're including a common maps setting on multiple pages, but each page
    // has a subset of the neighbors maps drawn.
    if (document.getElementById(elID) == null) {
        console.log("No element with ID '" + elID + "' so skipping that neighbors map.");
        return;
    }

    // load countries by names
    await loadBoundaries(mapDataDir, nMap.countries.map((el) => el[0]));

    // render all boundaries, cycling colors
    let mapNeighbors = await renderMap(elID);
    let allColors = nMap.countryColors || ["#FF4136", "#FF6300", "#FFD700", "#A463F2", "#FF80CC", "#19A974", "#357EDD"];
    let color = 0;
    let neighborOverlays = [];
    for (let i = 0; i < nMap.countries.length; i++) {
        let country = nMap.countries[i][0];
        let overlay = await renderOverlay(mapNeighbors, country, "mapOutlineNeighbors", allColors[color]);
        neighborOverlays.push(overlay);
        color = (color + 1) % allColors.length;
    }
    let neighborsBounds = L.latLngBounds(nMap.bounds);
    mapNeighbors.fitBounds(neighborsBounds);

    // We need to add labels and stuff after the bounds or leaflet freaks out.
    for (let i = 0; i < nMap.countries.length; i++) {
        await addLabel(
            mapNeighbors,
            nMap.countries[i][0],
            nMap.countries[i][1] == "auto" ? neighborOverlays[i].getBounds().getCenter() : nMap.countries[i][1],
            nMap.countries[i][2]
        );
    }

    // Add any places
    let hasPlaces = nMap.places && nMap.places.length > 0;
    let doLines = nMap.drawPlaceLines || false; // I think || false might be a noop lol
    if (hasPlaces) {
        await addPlaces(
            mapNeighbors,
            nMap.places,
            nMap.placeColor,
            doLines,
            [], // no active list
            {
                tooltipSmall: true,
                circleRadius: nMap.placeCircleRadius || 50000,
                tooltipExtraClasses: "dn di-ns",
            },
        );
    }

    let tl = anime.timeline({
        // easing: 'linear',
        easing: 'spring(1, 80, 8, 30)',
        direction: 'alternate', // Is not inherited
        loop: true, // Is not inherited
    });
    const animCountries = nMap.animateCountries == null || nMap.animateCountries;
    if (animCountries) {
        tl.add({
            targets: `#${elID} .mapOutlineNeighbors`,
            translateX: -3,
            translateY: -7,
            // opacity: 1,
            delay: anime.stagger(100, { start: 0 }),
        });
    }
    if (hasPlaces) {
        tl.add({
            targets: `#${elID} .mapPlace`,
            translateX: -3,
            translateY: -7,
            opacity: 1,
            delay: anime.stagger(300, { start: 0 }),
        }, (animCountries ? '-=1500' : ""));
    }
    if (doLines) {
        tl.add({
            targets: `#${elID} .mapPath`,
            opacity: 0.7,
            easing: 'easeInOutSine',
            duration: 500,
            strokeDashoffset: [anime.setDashoffset, 0],
            delay: anime.stagger(300, { start: 0 }),
        }, '-=2000');
    }
    tl.add({
        easing: "easeOutExpo",
        targets: `#${elID} .mapTooltip`,
        // translating breaks tooltip locations when map changes (zoom, pan);
        // they stop tracking the spot they're supposed to stay. Annoying because
        // markers and outlines do reposition correctly while animating.
        opacity: 0.9,
        delay: anime.stagger(100, { start: 0 }),
        endDelay: 1500,
    }, nMap.endTimelineOffset);

    new ResizeObserver((_, __) => {
        mapNeighbors.fitBounds(neighborsBounds);
    }).observe(document.getElementById(elID));
}

// execution
async function main() {
    // Common setup
    let mapDataDir = MAP_CONFIG.core.mapDataDir;
    await loadBoundaries(
        mapDataDir, MAP_CONFIG.subjectCountries.map(o => o.name),
    );
    // const photos = await loadLocations(MAP_CONFIG['trip']['locationsPath']);

    // Make maps
    await makeMapContext();
    await makeMapTrip();
    if (MAP_CONFIG.neighborsMaps != null) {
        for (let nMap of MAP_CONFIG.neighborsMaps) {
            await makeMapNeighbors(mapDataDir, nMap);
        }
    }
}

main();
