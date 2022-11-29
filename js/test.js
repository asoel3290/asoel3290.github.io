// Google layers
var g_roadmap = new L.Google('ROADMAP');
var g_satellite = new L.Google('SATELLITE');
var g_terrain = new L.Google('TERRAIN');

// OSM layers
var osmUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
var osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
var osm = new L.TileLayer(osmUrl, { attribution: osmAttrib });

// Bing layers
/*var bing1 = new L.BingLayer("AvZ2Z8Jve41V_bnPTe2mw4Xi8YWTyj2eT87tSGSsezrYWiyaj0ldMaVdkyf8aik6", { type: 'Aerial' });
var bing2 = new L.BingLayer("AvZ2Z8Jve41V_bnPTe2mw4Xi8YWTyj2eT87tSGSsezrYWiyaj0ldMaVdkyf8aik6", { type: 'Road' });*/


var counties = new L.GeoJSON.AJAX("data/FloridaCounties.geojson");
var low_mid = new L.GeoJSON.AJAX("data/FloridaCounties.geojson");
var low_end = new L.GeoJSON.AJAX("data/FloridaCounties.geojson");
var int_mid = new L.GeoJSON.AJAX("data/FloridaCounties.geojson");
var int_end = new L.GeoJSON.AJAX("data/FloridaCounties.geojson");
var high_mid = new L.GeoJSON.AJAX("data/FloridaCounties.geojson");
var high_end = new L.GeoJSON.AJAX("data/FloridaCounties.geojson");


/*// Sao Paulo Soybeans Plant
var soybeans_sp = new L.LayerGroup();
L.marker([-22, -49.80]).addTo(soybeans_sp),
    L.marker([-23, -49.10]).addTo(soybeans_sp),
    L.marker([-21, -49.50]).addTo(soybeans_sp);

// Sao Paulo Corn Plant
var corn_sp = new L.LayerGroup();
L.marker([-22, -48.10]).addTo(corn_sp),
    L.marker([-21, -48.60]).addTo(corn_sp);

// Rio de Janeiro Bean Plant
var bean_rj = new L.LayerGroup();
L.marker([-22, -42.10]).addTo(bean_rj),
    L.marker([-23, -42.78]).addTo(bean_rj);

// Rio de Janeiro Corn Plant
var corn_rj = new L.LayerGroup();
L.marker([-22, -43.20]).addTo(corn_rj),
    L.marker([-23, -43.50]).addTo(corn_rj);

// Rio de Janeiro Rice Plant
var rice_rj = new L.LayerGroup();
L.marker([-22, -42.90]).addTo(rice_rj),
    L.marker([-22, -42.67]).addTo(rice_rj),
    L.marker([-23, -42.67]).addTo(rice_rj);

// Belo Horizonte Sugar Cane Plant
var sugar_bh = new L.LayerGroup();
L.marker([-19, -44.90]).addTo(sugar_bh),
    L.marker([-19, -44.67]).addTo(sugar_bh);

// Belo Horizonte Corn Plant
var corn_bh = new L.LayerGroup();
L.marker([-19.45, -45.90]).addTo(corn_bh),
    L.marker([-19.33, -45.67]).addTo(corn_bh);*/


var map = L.map('map', {
    center: [25.8638, -80.8979],
    zoom: 8
});

map.addLayer(osm);
//counties.addTo(map);

var baseMaps = [
    { 
        groupName : "Google Base Maps",
        expanded : true,
        layers    : {
            "Satellite" :  g_satellite,
            "Road Map"  :  g_roadmap,
            "Terreno"   :  g_terrain
        }
    }, {
        groupName: "OSM Base Maps",
        layers: {
            "OpenStreetMaps": osm
        }
    }
];

var overlays = [
    {
        groupName: "Counties",
        expanded: true,
        layers: {
            "Counties": counties
        }
    }, {
        groupName: "Low",
        expanded: true,
        layers: {
            "2060": low_mid,
            "2100": low_end
        }
    }, {
        groupName: "Intermediate",
        expanded: true,
        layers: {
            "2060": int_mid,
            "2100": int_end        
        }
    }, {
        groupName: "High",
        expanded: true,
        layers: {
            "2060": high_mid,
            "2100": high_end        
        }
    }
    /*{
        groupName: "Sao Paulo",
        expanded: true,
        layers: {
            "Soybeans Plant": soybeans_sp,
            "Corn Plant": corn_sp
        }
    }, {
        groupName: "Rio de Janeiro",
        expanded: true,
        layers: {
            "Bean Plant": bean_rj,
            "Corn Plant": corn_rj,
            "Rice Plant": rice_rj
        }
    }, {
        groupName: "Belo Horizonte",
        layers: {
            "Sugar Cane Plant": sugar_bh
        }
    }*/
];

// configure StyledLayerControl options for the layer soybeans_sp
counties.StyledLayerControl = {
    removable: true,
    visible: false
}

// configure the visible attribute with true to corn_bh
low_end.StyledLayerControl = {
    removable: false,
    visible: true
}

var options = {
    container_width: "200px",
    group_maxHeight: "80px",
    //container_maxHeight : "350px", 
    exclusive: false,
    collapsed: true,
    position: 'topright'
};

var control = L.Control.styledLayerControl(baseMaps, overlays, options);
    map.addControl(control);

// test for adding new base layers dynamically
// to create a new group simply add a layer with new group name
//control.addBaseLayer(counties, "Bing Satellite", { groupName: "Bing Maps", expanded: true });
//control.addBaseLayer(bing2, "Bing Road", { groupName: "Bing Maps" });

// test for adding new overlay layers dynamically
//control.addOverlay(counties, "Corn Plant", { groupName: "Belo Horizonte" });

//control.removeLayer( counties );

//control.removeGroup( "Rio de Janeiro");

//control.selectLayer(low_mid);
//control.unSelectLayer(low_end); 

//control.selectGroup("Rio de Janeiro");
//control.unSelectGroup("Rio de Janeiro");

/*var popup = L.popup()
    .setLatLng([-16, -54])
    .setContent("The data that appears in this application are fictitious and do not represent actual data!")
    .openOn(map);

if (control.selectLayer(low_mid)) {
    map.addLayer(low_mid)
};
if (control.unSelectLayer(low_mid)) {
    map.removeLayer(low_mid)
};*/
