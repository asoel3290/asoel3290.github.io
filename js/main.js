//insert code here!
//declare map variable globally so all functions have access
var map;
var attrArray = ["1", "2", "3", "4", "7"];
var expressed = attrArray[0];

//create the map
var map = L.map('map', {
    center: [26.3014, -80.6321],
    zoom: 7
});

/*var counties = $.getJSON("data/FloridaCounties.geojson", function (response) {
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(response, {
        onEachFeature: onEachFeature,
        style: function (feature) {
            return {
                color: "black",
                fillColor: "black",
                fillOpacity: "80%"
            }
        }
    });

});

var one_ft = $.getJSON("data/FloridaCounties.geojson", function (response) {
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(response, {
        onEachFeature: onEachFeature,
        style: function (feature) {
            return {
                color: "blue",
                fillColor: "blue",
                fillOpacity: "0%"
            }
        }
    });
});

var two_ft = $.getJSON("data/FloridaCounties.geojson", function (response) {
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(response, {
        onEachFeature: onEachFeature,
        style: function (feature) {
            return {
                color: "pink",
                fillColor: "pink",
                fillOpacity: "50%"
            }
        }
    });
}).addTo(two_ft);*/

var counties = new L.GeoJson.AJAX("data/FloridaCounties.geojson");
counties.addTo(map);

//add OSM base tilelayer
var usmap = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
}).addTo(map);

//createSequenceControls();


// specify the basemap and overlays to put in the layers control
var baseMaps = {
    "US": usmap,
};

var overlayMaps = [{
    groupName : "Low",
    expanded: true,
    layers : {
        "Counties": counties,
        "One_Foot": one_ft,
        "Two_Feet": two_ft
    }
},{
    groupName : "Medium",
    expanded: true,
    layers : {
        "Counties": counties,
        "One_Foot": one_ft,
        "Two_Feet": two_ft    
    }
},{
    groupName : "High",
    expanded: true,
    layers : {
        "Counties": counties,
        "One_Foot": one_ft,
        "Two_Feet": two_ft  
    }
}];

var options = {
    container_width 	: "300px",
    container_maxHeight : "350px", 
    group_maxHeight     : "80px",
    exclusive       	: false
};

//L.control.layers(baseMaps, overlayMaps).addTo(map);

var control = L.Control.styledLayerControl(baseMaps, overlayMaps, options);
map.addControl(control);

//function to instantiate the Leaflet map
function createMap() {

    getData(map);

};

function onEachFeature(feature, layer) {
    //no property named popupContent; instead, create html string with all properties
    var popupContent = "";
    if (feature.properties) {
        //loop to add feature property names and values to html string
        for (var property in feature.properties) {
            popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
        }
        layer.bindPopup(popupContent);
    };
};

/*function createSequenceControls() {
    //create range input element (slider)
    var SequenceControl = L.Control.extend({
        options: {
            position: 'bottomleft'
        },

        onAdd: function () {
            // create the control container div with a particular class name
            var container = L.DomUtil.create('div', 'sequence-control-container');

            // ... initialize other DOM elements
            $(container).append('<input class="range-slider" type="range">');
            $(container).append('<button class="step" id="reverse" title="Reverse">Reverse</button>');
            $(container).append('<button class="step" id="forward" title="Forward">Forward</button>');


            L.DomEvent.disableClickPropagation(container);

            return container;
        }
    });
    map.addControl(new SequenceControl());
    $('.range-slider').attr({
        max: 2,
        min: 0,
        value: 0,
        step: 1
    });
    $('.step').click(function () {
        //sequence
        //get the old index value
        var index = $('.range-slider').val();

        //Step 6: increment or decrement depending on button clicked
        if ($(this).attr('id') == 'forward') {
            index++;
            //Step 7: if past the last attribute, wrap around to first attribute
            index = index > 2 ? 0 : index;
        } else if ($(this).attr('id') == 'reverse') {
            index--;
            //Step 7: if past the first attribute, wrap around to last attribute
            index = index < 0 ? 2 : index;
        };

        //Step 8: update slider
        $('.range-slider').val(index);

        //Step 9: pass new attribute to update symbols
        updatePropSymbols(index);        
    });
    $('.range-slider').on('input', function(){
        //sequence
        var index = $(this).val();        
        updatePropSymbols(index); 
    });

    //replace button content with images
    $('#reverse').html('<img src="img/reverse.png">');
    $('#forward').html('<img src="img/forward.png">');
};

function updatePropSymbols(index) {

    if (index == 0) {

        control.removeLayer( counties );
        control.removeLayer( one_ft );
        control.removeLayer( two_ft );

    } else if (index == 1) {

        counties.opacity = "0%";
        one_ft.opacity = "100%";
        two_ft.opacity = "0%";

    } else if (index == 2) {

        counties.opacity = "0%";
        one_ft.opacity = "0%";
        two_ft.opacity = "100%";

    };

};

//function to retrieve the data and place it on the map
function getData(map) {
    // parse the geojson (very simplified example here)
    counties;
    one_ft;
    two_ft;
}*/

$(document).ready(createMap);
//$(document).ready(createSequenceControls(map));