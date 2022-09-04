let allBoundaryData = {};
let centroidData = {};

async function renderMap(elId, countryForCentroid) {
    const centroidItem = centroidData.find(c => c.long_name == countryForCentroid);

    // replace "toner" here with "terrain" or "watercolor"
    // toner
    // toner-lite
    // toner-background
    var layer = new L.StamenTileLayer("toner-background");
    let map = new L.Map(elId, {
        // center: new L.LatLng(46.786845, 2.715824),
        center: new L.LatLng(parseFloat(centroidItem.center_lat), parseFloat(centroidItem.center_lng)),
        zoom: window.innerWidth < 600 ? 4.25 : 4.75,
        zoomSnap: 0.25,
        scrollWheelZoom: false,
        attributionControl: false,
    });
    map.addLayer(layer);

    // make base map lighter
    map.getPane("tilePane").style.opacity = .7;
    return map;
}

async function loadCentroids() {
    // centroid attribution: https://github.com/mihai-craita/countries_center_box
    let response = await fetch(libDir + "country-centroids.json")
    centroidData = await response.json();

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

async function renderOverlay(map, country, className, color, strokeColor = null) {
    let country_slug = country.toLowerCase().replace(' ', '-');
    let boundaryData = allBoundaryData[country_slug];
    let boundary = L.geoJSON(boundaryData, {
        style: {
            // stroke
            // stroke: false,
            color: strokeColor == null ? color : strokeColor,
            weight: 1,  // stroke width
            // opacity: 0.4,
            // fill
            fillColor: color,
            // fillOpacity: 0.4,
            className: className,
        }
    }).addTo(map);
    // return boundary;
}



// execution
async function main() {
    await loadBoundaries([
        'United Kingdom', 'England', 'Wales', 'Scotland', 'Northern Ireland', 'Ireland',
    ]);
    await loadCentroids();

    {
        let map = await renderMap("mapGeo", "United Kingdom");
        await renderOverlay(map, 'England', "map1", "#5E2CA5");
        await renderOverlay(map, 'Wales', "map1", "#5E2CA5");
        await renderOverlay(map, 'Scotland', "map1", "#5E2CA5");
        await renderOverlay(map, 'Northern Ireland', "map1", "#FF41B4");
        await renderOverlay(map, 'Ireland', "map1", "#FF41B4");
    }

    {
        let map = await renderMap("mapCountry", "United Kingdom");
        await renderOverlay(map, 'England', "map2", "#FF4136");
        await renderOverlay(map, 'Wales', "map2", "#FFD700");
        await renderOverlay(map, 'Scotland', "map2", "#357EDD");
        await renderOverlay(map, 'Northern Ireland', "map2", "#19A974");
        await renderOverlay(map, 'Ireland', "map2", "#FF6300");
    }

    {
        let map = await renderMap("mapPolitical", "United Kingdom");
        await renderOverlay(map, 'United Kingdom', "map3", "#357EDD");
        await renderOverlay(map, 'Ireland', "map3", "#FF6300");
    }

    anime({
        targets: '.map1',
        translateX: -3,
        translateY: -7,
        easing: 'spring(1, 80, 8, 20)',
        delay: anime.stagger(100, {
            start: 500, easing: function (i) {
                return i < 0.6 ? 0 : 1;
            }
        }),
        loop: true,
        direction: "alternate",
    });
    anime({
        targets: '.map2',
        translateX: -3,
        translateY: -7,
        easing: 'spring(1, 80, 8, 20)',
        delay: anime.stagger(150, {
            start: 500,
        }),
        loop: true,
        direction: "alternate",
    });
    anime({
        targets: '.map3',
        translateX: -3,
        translateY: -7,
        easing: 'spring(1, 80, 8, 20)',
        delay: anime.stagger(150, {
            start: 500,
        }),
        loop: true,
        direction: "alternate",
    });
}

main();
