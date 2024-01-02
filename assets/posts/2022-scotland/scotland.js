// External vars expected (w/ example vals):
// let libDir = "/lib/";
// let postDir = "/lib/";
// let activeList = ["Aberdeen"];

// Addl. globals
let allBoundaryData = {};

async function renderMap(elId, centroid, startZoom) {
  // remove any placeholder img
  for (let child of document.getElementById(elId).children) {
    // my stupid stylesheet overrules tachyon's display none (dn) with
    // my ":not(bare)" display definition, so adding bare and dn...
    child.classList.add("bare");
    child.classList.add("dn");
  }

  // replace "toner" here with "terrain" or "watercolor"
  // toner
  // toner-lite
  // toner-background
  let layer = L.maplibreGL({
    style: `https://tiles.stadiamaps.com/styles/stamen_toner_background.json`,
    attribution:
      '&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> <a href="https://stamen.com/" target="_blank">&copy; Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/about" target="_blank">OpenStreetMap</a> contributors',
  });
  let map = new L.Map(elId, {
    // center: new L.LatLng(46.786845, 2.715824),
    center: new L.LatLng(centroid[0], centroid[1]),
    zoom: startZoom,
    // zoom: 6.5,
    zoomSnap: 0.25,
    scrollWheelZoom: false,
    attributionControl: false,
    dragging: false,
  });
  map.addLayer(layer);

  // make base map lighter
  map.getPane("tilePane").style.opacity = 0.7;
  return map;
}

async function loadBoundaries(countries) {
  // country geojson attribution: https://datahub.io/core/geo-countries#data
  // Scotland, N-Ireland from: https://github.com/Crunch-io/geodata
  // England, Wales from https://martinjc.github.io/UK-GeoJSON/
  for (let country of countries) {
    let country_slug = country.toLowerCase().replace(" ", "-");
    // console.log("Downloading " + country_slug);
    let response = await fetch(
      libDir + "country-boundaries/" + country_slug + ".geojson"
    );
    let boundaryData = await response.json();
    // console.log(boundaryData['geometry']);
    allBoundaryData[country_slug] = boundaryData;
  }
}

async function loadLocations(path) {
  const fullPath = postDir + path;
  let response = await fetch(fullPath);
  return await response.json();
}

async function addLocations(map, locations, className) {
  for (let coord of locations) {
    let circle = L.circle(coord, {
      color: "white",
      // stroke: false,
      weight: 1,
      // fillColor: '#4C4C4C',
      // fillColor: '#FF6300',
      fillColor: "#357EDD",
      // fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 2500,
      className: className,
    }).addTo(map);
  }
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
    let thetaOffset = 3.1416 / 8;

    let r2 = r / 2 / Math.cos(thetaOffset);
    // orig: +; swap to - to reverse bulge direction.
    let theta2 = bulge == "in" ? theta + thetaOffset : theta - thetaOffset;

    let midpointX = r2 * Math.cos(theta2) + latlng1[1],
      midpointY = r2 * Math.sin(theta2) + latlng1[0];

    let midpointLatLng = [midpointY, midpointX];

    // latlngs.push(latlng1, midpointLatLng, latlng2);

    let curvedPath = L.curve(["M", latlng1, "Q", midpointLatLng, latlng2], {
      color: "#357EDD",
      // color: '#fff',
      weight: 10,
      className: className,
    }).addTo(map);
  }
}

/**
 *
 * @param {*} places = [[lat, lon, label, tooltipDirection]]
 * tooltipDirection \in {right, left, top, bottom, center, auto}
 */
async function addPlaces(map, places, className) {
  // connecting lines
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
      color: "white",
      // stroke: false,
      weight: 3,
      // fillColor: '#FF6300',
      fillColor: active ? "#FF6300" : "#357EDD",
      fillOpacity: active ? 0.9 : 0.5,
      radius: 10000,
      className: className,
    }).addTo(map);

    // labels
    let hOffset = direction == "right" ? 10 : direction == "left" ? -10 : 0;
    let vOffset = direction == "bottom" ? 10 : direction == "top" ? -10 : 0;
    circle
      .bindTooltip(name, {
        className:
          className + " sans-serif f6 f5-ns" + (active ? " mapPlaceActive" : ""),
        permanent: true,
        direction: direction,
        offset: L.point(hOffset, vOffset),
        opacity: 0,
      })
      .openTooltip();
  }
}

async function renderOverlay(map, country, className, color, fillOpacity = null) {
  let country_slug = country.toLowerCase().replace(" ", "-");
  let boundaryData = allBoundaryData[country_slug];
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
async function main() {
  // manual centroid because nobody thinks scotland is a country
  let centroid = [57.056274, -4.272138];
  // TODO: query the actual map element. (Ideally we'd also adjust zoom on the fly for resizes...)
  const closeMapZoom = window.innerWidth < 600 ? 5.5 : 6.5;
  await loadBoundaries(["Scotland"]);
  const photos = await loadLocations("2022-scotland-photo-locations-shuffled.json");
  const places = [
    [55.953, -3.189, "Edinburgh", "right", "in"],
    [57.15, -2.11, "Aberdeen", "right", "out"],
    [57.4778, -4.2247, "Inverness", "top", "out"],
    [57.27527, -6.042294, "Isle of Skye", "left", "in"],
    [56.412, -5.472, "Oban", "right", "in"],
    [55.8611, -4.25, "Glasgow", "left", "n/a"],
  ];

  // mapTrip: the traveling route
  // console.log("Using travel map with zoom:", closeMapZoom);
  let mapTrip = await renderMap("mapTravel", centroid, closeMapZoom);
  await renderOverlay(mapTrip, "Scotland", "mapOutlineTravel", "#357EDD");
  await addLocations(mapTrip, photos, "mapMarker");
  await addPlaces(mapTrip, places, "mapPlace");

  let tl = anime.timeline({
    // easing: 'linear',
    easing: "spring(1, 80, 8, 30)",
    direction: "alternate", // Is not inherited
    loop: true, // Is not inherited
  });
  tl.add(
    {
      targets: ".mapOutlineTravel",
      translateX: -3,
      translateY: -7,
      opacity: 1,
    },
    "+=1000"
  );
  tl.add(
    {
      targets: ".mapPlace",
      translateX: -3,
      translateY: -7,
      opacity: 1,
      delay: anime.stagger(100, { start: 0 }),
    },
    "-=1500"
  );
  tl.add(
    {
      targets: ".mapPath",
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
      targets: ".mapMarker",
      translateX: -3,
      translateY: -7,
      opacity: 1,
      delay: anime.stagger(7, { start: 0 }),
    },
    "-=1500"
  );
  // tl.add({
  //     targets: '.mapPlaceActive',
  //     translateX: 3,
  //     // translateY: -7,
  // }, '-=3000');

  // mapContext: zoomed out
  const startZoom = closeMapZoom - 3;
  // const finalZoom = closeMapZoom - 2;
  let mapContext = await renderMap("mapContext", centroid, startZoom);
  await renderOverlay(mapContext, "Scotland", "mapOutlineContext", "#357EDD", 0.6);

  {
    anime({
      targets: ".mapOutlineContext",
      // translateX: -3,
      // translateY: -7,
      // easing: "easeInExpo",
      easing: "easeInOutSine",
      direction: "alternate", // Is not inherited
      loop: true, // Is not inherited
      duration: 1000,
      // delay: 1000,
      endDelay: 250,
      opacity: 1.0,
    });
    // NOTE: Leaflet has no caching, so this results in endless image
    // downloads! I checked out homebrew caching solutions but the few I
    // found had demos that were broken and/or seemed like a pain to setup
    // (packing + GitHub issues about setup errors). Plus, it still looks
    // terrible because of the jitteriness, tiles loading, and lack of
    // smooth transitions between tiles and outline resolutions. So, just
    // disabling this whole thing for now. Sad.
    // setInterval(() => {
    //     let nextZoom = mapContext.getZoom() == finalZoom ? startZoom : finalZoom;
    //     // setZoom apparently has animation duration hardcoded,
    //     // see https://gis.stackexchange.com/a/228391
    //     // Changing the hardcoded time as suggested doesn't do anything.
    //     // mapContext.setZoom(nextZoom, {
    //     //     animate: true,
    //     //     duration: 2,
    //     // });
    //     // console.log("Zooming to ", nextZoom);
    //     // NOTE: I had to monkeypatch a piece of the flyTo method because it
    //     // totally ignores the `easeLinearity` parameter that it says it takes,
    //     // so all easing was (ugly) linear. See the author's comment in this
    //     // SO answer: https://stackoverflow.com/a/54628530
    //     // This is still bad, as it's horribly shaky.
    //     mapContext.flyTo(centroid, nextZoom, {
    //         animate: true,
    //         duration: 1,
    //     });
    //     // mapContext.invalidateSize();
    //     // mapCtrl.prevZoom = nextZoom;
    // }, 5000);
  }
}

main();
