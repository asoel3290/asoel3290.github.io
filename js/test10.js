function createMap() {
    var counties = new L.GeoJSON.AJAX("data/FloridaCounties_simp.json", {
        style: {
            "color": "#000000",
            "weight": 1,
            "fillOpacity": 0
        }
    });
    var low_end = new L.GeoJSON.AJAX("data/fl_slr_2ft_smp.json", {
        style: {
            "color": "#0000FF",
            "weight": 1,
            "fill-opacity": 0.8
        }
    });
    var int_end = new L.GeoJSON.AJAX("data/fl_slr_4ft_smp.json", {
        style: {
            "color": "#0000FF",
            "weight": 1,
            "fill-opacity": 0.8
        }
    });
    var high_end = new L.GeoJSON.AJAX("data/fl_slr_7ft_smp.json", {
        style: {
            "color": "#0000FF",
            "weight": 1
        }
    });

    var osmUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
    var osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    var osm = new L.TileLayer(osmUrl, { minZoom: 8, attribution: osmAttrib });

    //var streets = L.tileLayer(mapboxUrl, {id: 'mapbox/streets-v11', tileSize: 512, zoomOffset: -1, attribution: mapboxAttribution});

    var map = new L.map('map', {
        center: [25.8638, -80.8979],
        zoom: 8,
        layers: [osm, counties]
    });

    var baseMaps = {
        "OpenStreetMap": osm,
        //"Mapbox Streets": streets
    };

    var overlayMaps = {
        "Low": low_end,
        "Intermediate": int_end,
        "High": high_end
    };

    var layerControl = L.control.layers(overlayMaps).addTo(map);

}