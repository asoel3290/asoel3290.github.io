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

var broward = new L.GeoJSON.AJAX("data/Broward.geojson", {
    style: {
        "color": "#e41a1c",
        "weight": 1,
        "fillOpacity": 0.8
    }
});

var collier = new L.GeoJSON.AJAX("data/Collier.geojson", {
    style: {
        "color": "#377eb8",
        "weight": 1,
        "fillOpacity": 0.8
    }
});

var miami = new L.GeoJSON.AJAX("data/Miami.geojson", {
    style: {
        "color": "#4daf4a",
        "weight": 1,
        "fillOpacity": 0.8
    }
});

var monroe = new L.GeoJSON.AJAX("data/Monroe.geojson", {
    style: {
        "color": "#984ea3",
        "weight": 1,
        "fillOpacity": 0.8
    }
});

var palmbeach = new L.GeoJSON.AJAX("data/PalmBeach.geojson", {
    style: {
        "color": "#ff7f00",
        "weight": 1,
        "fillOpacity": 0.8
    }
});

var osmUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
var osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
var osm = new L.TileLayer(osmUrl, { minZoom: 7.5, attribution: osmAttrib });

//var streets = L.tileLayer(mapboxUrl, {id: 'mapbox/streets-v11', tileSize: 512, zoomOffset: -1, attribution: mapboxAttribution});

var counties_b = L.layerGroup([broward, collier, miami, monroe, palmbeach]);

var map = new L.map('map', {
    center: [25.8638, -80.8979],
    zoom: 8,
    layers: [osm, counties, counties_b]
});
L.Control.geocoder().addTo(map);

var baseMaps = {
    "OpenStreetMap": osm,
    //"Mapbox Streets": streets
};

var overlayMaps = {
    "Low": low_end,
    "Intermediate": int_end,
    "High": high_end
};

var counties_colored = {
    "Counties": counties_b
}

/*var counties_a = {
    "Broward": broward,
    "Collier": collier,
    "Miami-Dade": miami,
    "Monroe": monroe,
    "Palm-Beach": palmbeach
}*/

var layerControl = L.control.layers(overlayMaps, counties_colored).addTo(map);

//layerControl.addOverlay(counties, "Counties");

// When the user clicks on <div>, open the popup
function myFunction() {
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
}

function creatorPopup() {
    var creators = document.getElementById("cPopup");
    creators.classList.toggle("show");
}
//Stuff for the legend
var COLORS = ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00'],
    LABELS = ["Broward", "Collier", "Miami-Dade", "Monroe", "Palm-Beach"],
    VALUES = ["val0", "val1", "val2", "val3", "val4"]

var legcolor = d3.scaleOrdinal()
    .range(COLORS);

// set the dimensions and margins of the graph
var margin = { top: 50, right: 30, bottom: 20, left: 50 },
    width = window.innerWidth * 0.7 - margin.left - margin.right,
    height = window.innerHeight * 0.8 - margin.top - margin.bottom;

var title = "Population at Risk"

// append the svg object to the body of the page
svg = d3.select("#graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function readCsv(filename) {

    // Parse the Data
    d3.csv(filename, function (data) {

        // List of subgroups = header of the csv files = soil condition here
        var subgroups = data.columns.slice(1)

        // List of groups = species here = value of the first column called group -> I show them on the X axis
        var groups = d3.map(data, function (d) { return (d.scenario) }).keys()

        svg.append("rect")
            .attr("x", -100)
            .attr("y", -100)
            .attr("width", width + 150)
            .attr("height", height + 150)
            .attr("fill", "#E2FFFC")

        // Add X axis
        var x = d3.scaleBand()
            .domain(groups)
            .range([0, width])
            .padding([0.2])
        svg.append("g")
            .style("font", "20px helvetica")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickSize(0));

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, 100])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Another scale for subgroup position?
        var xSubgroup = d3.scaleBand()
            .domain(subgroups)
            .range([0, x.bandwidth()])
            .padding([0.05])

        // color palette = one color per subgroup
        const color = d3.scaleOrdinal()
            .domain(subgroups)
            .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00'])

        // Show the bars
        svg.append("g")
            .selectAll("g")
            // Enter in data = loop group per group
            .data(data)
            .enter()
            .append("g")
            .attr("transform", function (d) { return "translate(" + x(d.scenario) + ",0)"; })
            .selectAll("rect")
            .data(function (d) { return subgroups.map(function (key) { return { key: key, value: d[key] }; }); })
            .enter().append("rect")
            .attr("x", function (d) { return xSubgroup(d.key); })
            .attr("y", function (d) { return y(d.value); })
            .attr("width", xSubgroup.bandwidth())
            .attr("height", function (d) { return height - y(d.value); })
            .attr("fill", function (d) { return color(d.key); });

        //title
        svg.append("text")
            .attr("x", 0)
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "left")
            .style("font-size", "24px")
            .style("color", "Navy")
            //.style("text-decoration", "underline")  
            .text("Percentage of " + title);

        //legend
        var legspacing = 25;

        var legend = svg.selectAll(".legend")
            .data(VALUES)
            .enter()
            .append("g")

        legend.append("rect")
            .attr("fill", legcolor)
            .attr("width", 20)
            .attr("height", 20)
            .attr("y", function (d, i) {
                return 20 + (i * legspacing - 20);
            })
            .attr("x", 20);

        legend.append("text")
            .attr("class", "label")
            .attr("y", function (d, i) {
                return 20 + (i * legspacing - 6);
            })
            .attr("x", 45)
            .attr("text-anchor", "start")
            .text(function (d, i) {
                return LABELS[i];
            });

        legend.append("rect")
            .attr("x", 20)
            .attr("y", 6 * legspacing - 20)
            .attr("width", 20)
            .attr("height", 20)
            .attr("fill", "url(#diagonalHatch)")

        legend.append("text")
            .attr("class", "label")
            .attr("y", 6 * legspacing - 6)
            .attr("x", 45)
            .attr("text-anchor", "start")
            .text("Indicates the risk in 2060");
    })
};

// 2060 test
function sixtyCsv(filename) {

    // Parse the Data
    d3.csv(filename, function (data) {
        // append the svg object to the body of the page
        // List of subgroups = header of the csv files = soil condition here
        var subgroups = data.columns.slice(1)

        // List of groups = species here = value of the first column called group -> I show them on the X axis
        var groups = d3.map(data, function (d) { return (d.scenario) }).keys()

        // Add X
        var x = d3.scaleBand()
            .domain(groups)
            .range([0, width])
            .padding([0.2])

        var y = d3.scaleLinear()
            .domain([0, 100])
            .range([height, 0]);

        // Another scale for subgroup position?
        var xSubgroup = d3.scaleBand()
            .domain(subgroups)
            .range([0, x.bandwidth()])
            .padding([0.05])

        svg
            .append('defs')
            .append('pattern')
            .attr('id', 'diagonalHatch')
            .attr('patternUnits', 'userSpaceOnUse')
            .attr('width', 4)
            .attr('height', 4)
            .append('path')
            .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
            .attr('stroke', '#000000')
            .attr('stroke-width', 1);

        // Show the bars
        svg.append("g")
            .selectAll("g")
            // Enter in data = loop group per group
            .data(data)
            .enter()
            .append("g")
            .attr("transform", function (d) { return "translate(" + x(d.scenario) + ",0)"; })
            .selectAll("rect")
            .data(function (d) { return subgroups.map(function (key) { return { key: key, value: d[key] }; }); })
            .enter().append("rect")
            .attr("x", function (d) { return xSubgroup(d.key); })
            .attr("y", function (d) { return y(d.value); })
            .attr("width", xSubgroup.bandwidth())
            .attr("height", function (d) { return height - y(d.value); })
            .attr('fill', 'url(#diagonalHatch)');
    })
};

d3.selectAll('.selector')
    .on('click', function (d) {

        readCsv("data/"+this.id + ".csv");
        title = this.value;
        sixtyCsv("data/"+this.id + "-2060.csv");
    });

readCsv("data/population-at-risk.csv");
sixtyCsv("data/population-at-risk-2060.csv");

