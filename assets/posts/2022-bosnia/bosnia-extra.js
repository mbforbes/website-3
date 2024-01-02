// External vars expected (w/ example vals):
// let libDir = "/lib/";
// let postDir = "/lib/";
// let activeList = [""];
//
// This is also external since this is the second set of maps
// let allBoundaryData = {};

async function renderMap2(elId) {
  // remove any placeholder img
  for (let child of document.getElementById(elId).children) {
    // my stupid stylesheet overrules tachyon's display none (dn) with
    // my ":not(bare)" display definition, so adding bare and dn...
    child.classList.add("bare");
    child.classList.add("dn");
  }

  // replace "toner" here with "terrain" or "watercolor"
  // let layer = new L.StamenTileLayer("toner-background", { detectRetina: true });
  let layer = L.maplibreGL({
    style: `https://tiles.stadiamaps.com/styles/stamen_toner_background.json`,
    attribution:
      '&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> <a href="https://stamen.com/" target="_blank">&copy; Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/about" target="_blank">OpenStreetMap</a> contributors',
  });
  let map = new L.Map(elId, {
    zoomSnap: 0.25,
    scrollWheelZoom: false,
    attributionControl: false,
    dragging: false,
    zoomControl: false,
  });
  map.addLayer(layer);

  // make base map lighter
  map.getPane("tilePane").style.opacity = 0.5;
  return map;
}

async function loadBoundaries2(countries) {
  // country geojson attribution: https://datahub.io/core/geo-countries#data
  // Scotland, N-Ireland from: https://github.com/Crunch-io/geodata
  // England, Wales from https://martinjc.github.io/UK-GeoJSON/
  for (let country of countries) {
    let country_slug = country.toLowerCase().replace(/ /gi, "-");
    // console.log(country_slug);
    // console.log("Downloading " + country_slug);
    let response = await fetch(
      libDir + "country-boundaries/" + country_slug + ".geojson"
    );
    let boundaryData = await response.json();
    // console.log(boundaryData['geometry']);
    allBoundaryData[country_slug] = boundaryData;
  }
}

async function loadLocations2(path) {
  const fullPath = postDir + path;
  let response = await fetch(fullPath);
  return await response.json();
}

/**
 *
 * @param {*} places = [[lat, lon, label, tooltipDirection]]
 * tooltipDirection \in {right, left, top, bottom, center, auto}
 */
async function addPlaces2(map, places, className, ttClassName, doAddLines) {
  // lines connecting places
  if (doAddLines) {
    let coords = places.map((el) => [el[0], el[1], el[4]]);
    addLines2(map, coords, "mapPath");
  }

  // places
  for (let place of places) {
    // dots
    let coord = [place[0], place[1]];
    let name = place[2];
    let direction = place[3];
    let active = activeList.indexOf(name) != -1;
    let circle = L.circle(coord, {
      color: "white",
      // stroke: false,
      weight: 3,
      fillColor: "#357EDD",
      // fillColor: active ? '#FFF' : '#357EDD',
      fillOpacity: active ? 0.9 : 0.5,
      radius: 1500,
      className: className,
    }).addTo(map);

    // labels
    let hOffset = direction == "right" ? 10 : direction == "left" ? -15 : 0;
    // let vOffset = direction == "bottom" ? 10 : (direction == "top" ? -10 : 0);
    // hack to get tooltip to line up with offset marker. couldn't get offsets in CSS to work,
    // but I should try to fix in future.
    // let hOffset = 10;
    let vOffset = -7;
    circle
      .bindTooltip(name, {
        // className: className + " sans-serif f6 f5-ns" + (active ? " mapPlaceActive" : ""),
        className:
          ttClassName + " sans-serif f6 f5-l" + (active ? " mapPlaceActive" : ""),
        permanent: true,
        direction: direction,
        offset: L.point(hOffset, vOffset),
        opacity: 0,
      })
      .openTooltip();
  }
}

async function addLines2(map, coords, className) {
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
    let thetaOffset = 3.1416 / 10;

    let r2 = r / 2 / Math.cos(thetaOffset);
    // orig: +; swap to - to reverse bulge direction.
    let theta2 = bulge == "in" ? theta + thetaOffset : theta - thetaOffset;

    let midpointX = r2 * Math.cos(theta2) + latlng1[1],
      midpointY = r2 * Math.sin(theta2) + latlng1[0];

    let midpointLatLng = [midpointY, midpointX];

    // latlngs.push(latlng1, midpointLatLng, latlng2);

    // console.log("Adding line");
    let curvedPath = L.curve(["M", latlng1, "Q", midpointLatLng, latlng2], {
      color: "#F6CA6B",
      // color: '#fff',
      weight: 10,
      className: className,
    }).addTo(map);
  }
}

async function renderOverlay2(map, country, className, color, fillOpacity = null) {
  let country_slug = country.toLowerCase().replace(/ /gi, "-");
  let boundaryData = allBoundaryData[country_slug];
  if (boundaryData == null) {
    throw Error("Couldn't find boundary data for '" + country_slug + "'");
  }
  let boundary = L.geoJSON(boundaryData, {
    style: {
      // stroke
      // stroke: false,
      color: color, // NOTE: may want white outline for blur...
      weight: 1, // stroke width
      // opacity: 0.4,
      // fill
      fillColor: color,
      fillOpacity: fillOpacity || 0.4,
      className: className,
    },
  }).addTo(map);
  return boundary;
}

// execution
async function main2() {
  await loadBoundaries2([
    "Bosnia and Herzegovina",
    "Serbia",
    "Croatia",
    "Montenegro",
    "Kosovo",
  ]);
  // const photos = await loadLocations2("2022-scotland-photo-locations-shuffled.json");
  const countries = [
    [43.870835, 17.862889, "B&H", "top", "in"],
    [45.809319, 15.976646, "Croatia", "left", "in"],
    [44.809199, 20.447907, "Serbia", "right", "in"],
    // capital
    // [42.662417, 21.160824, "Kosovo", "bottom", "in"],
    // lower
    [42.176047, 21.027428, "Kosovo", "bottom", "in"],
    // capital
    // [42.441045, 19.257847, "Montenegro", "left", "in"],
    // lower
    [42.081407, 19.358047, "Montenegro", "left", "in"],
  ];

  // mapNeighbors: who is nearby
  // ---
  const map1ID = "mapNeighbors";
  let mapNeighbors = await renderMap2(map1ID);
  let contextBoundary = await renderOverlay2(
    mapNeighbors,
    "Bosnia and Herzegovina",
    "mapOutlineNeighbor",
    "#357EDD"
  );
  let croatiaBoundary = await renderOverlay2(
    mapNeighbors,
    "Croatia",
    "mapOutlineNeighbor",
    "#FFD700"
  );
  let serbiaBoundary = await renderOverlay2(
    mapNeighbors,
    "Serbia",
    "mapOutlineNeighbor",
    "#E7040F"
  );
  let kosovoBoundary = await renderOverlay2(
    mapNeighbors,
    "Kosovo",
    "mapOutlineNeighbor",
    "#FF725C"
  );
  let montenegroBoundary = await renderOverlay2(
    mapNeighbors,
    "Montenegro",
    "mapOutlineNeighbor",
    "#FF725C"
  );
  let contextBounds = contextBoundary.getBounds().pad(1.5); // probably need to adjust per country
  mapNeighbors.fitBounds(contextBounds);
  await addPlaces2(mapNeighbors, countries, "o-0", "countryTooltips", false);
  {
    const map1Sel = "#" + map1ID + " ";
    let tl = anime.timeline({
      direction: "alternate", // Is not inherited
      loop: true, // Is not inherited
    });
    tl.add({
      targets: map1Sel + ".mapOutlineNeighbor",
      // easing: "easeInOutSine",
      duration: 1500,
      easing: "spring(1, 80, 8, 20)",
      delay: anime.stagger(150, {
        start: 500,
      }),
      // delay: 1000,
      endDelay: 250,
      // opacity: 0.9,
      translateX: -3,
      translateY: -7,
    });
    tl.add(
      {
        easing: "easeOutExpo",
        targets: map1Sel + ".countryTooltips",
        // translating breaks tooltip locations when map changes (zoom, pan);
        // they stop tracking the spot they're supposed to stay. Annoying because
        // markers and outlines do reposition correctly while animating.
        opacity: 0.9,
        delay: anime.stagger(150, {
          // start: 500,
        }),
        endDelay: 1500,
      },
      "-=2000"
    );
  }

  // mapHerzegovina: the hertz tour route
  // ---
  const places = [
    [43.3494, 17.8125, "Mostar", "right", "in"],
    [43.257045, 17.903392, "Blagaj", "right", "in"], // monastery
    [43.237721, 17.833538, "Bunski kanal", "left", "in"], //  rivers meeting
    [43.134788, 17.732242, "Počitelj", "right", "in"], // old town, mostly abandoned
    [43.155821, 17.607946, "Kravica Waterfalls", "left", "in"],
  ];
  const map2ID = "mapHerzegovina";
  let mapHerzegovina = await renderMap2(map2ID);
  let tripOverlay = await renderOverlay2(
    mapHerzegovina,
    "Bosnia and Herzegovina",
    "mapOutlineTravel",
    "#357EDD",
    0.2
  );
  // let croatiaBoundary2 = await renderOverlay2(mapHerzegovina, 'Croatia', "mapOutlineTravel", "#FFD700", 0.2);
  // let tripBounds = tripOverlay.getBounds().pad(-0.2);  // probably good universally (edit: wasn't lol. was 0.05)
  let tripBounds = L.latLngBounds(places.map((el) => [el[0], el[1]])).pad(1.8);
  mapHerzegovina.fitBounds(tripBounds);
  // await addLocations(mapHerzegovina, photos, "mapMarker");
  await addPlaces2(mapHerzegovina, places, "mapPlace", "mapTooltip", true);

  const map2Sel = "#" + map2ID + " ";
  let tl = anime.timeline({
    // easing: 'linear',
    easing: "spring(1, 80, 8, 30)",
    direction: "alternate", // Is not inherited
    loop: true, // Is not inherited
  });
  // tl.add({
  //     targets: '.mapOutlineTravel',
  //     translateX: -3,
  //     translateY: -7,
  //     // opacity: 1,
  // }, "+=1000");
  tl.add({
    targets: map2Sel + ".mapPlace",
    translateX: -3,
    translateY: -7,
    opacity: 1,
    delay: anime.stagger(100, { start: 500 }),
  });
  tl.add(
    {
      targets: map2Sel + ".mapPath",
      opacity: 0.7,
      easing: "easeInOutSine",
      duration: 250,
      strokeDashoffset: [anime.setDashoffset, 0],
      delay: anime.stagger(250, { start: 0 }),
    },
    "-=2000"
  );
  tl.add(
    {
      easing: "easeOutExpo",
      targets: map2Sel + ".mapTooltip",
      // translating breaks tooltip locations when map changes (zoom, pan);
      // they stop tracking the spot they're supposed to stay. Annoying because
      // markers and outlines do reposition correctly while animating.
      opacity: 0.9,
      delay: anime.stagger(100, { start: 0 }),
      endDelay: 1500,
    },
    "-=1500"
  );

  // `ResizeObserver1 works better than `window.addEventListener('resize', ...)`.
  // I originally thought it was because events were being dropped, but upon further
  // inspection, they aren't. My hypothesis now is that the events are firing before
  // the map knows its new screen size, so the zoom uses the old level.
  new ResizeObserver((_, __) => {
    mapHerzegovina.fitBounds(tripBounds);
  }).observe(document.getElementById("mapHerzegovina"));
  new ResizeObserver((_, __) => {
    mapNeighbors.fitBounds(contextBounds);
  }).observe(document.getElementById("mapNeighbors"));
}

main2();
