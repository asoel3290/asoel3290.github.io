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

layerControl.addOverlay(counties, "Counties");



var COLORS = ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00'],
    LABELS = ["Broward", "Collier", "Miami-Dade", "Monroe", "Palm-Beach"],
    VALUES = ["val0", "val1", "val2", "val3", "val4"]

var legcolor = d3.scaleOrdinal()
    .range(COLORS);

// set the dimensions and margins of the graph
var margin = { top: 50, right: 30, bottom: 20, left: 50 },
    width = window.innerWidth * 0.7 - margin.left - margin.right,
    height = window.innerHeight * 0.8 - margin.top - margin.bottom;

// append the svg object to the body of the page
/*var svg = d3.select("#graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var legspacing = 25;

var legend = svg.selectAll(".legend")
    .data(VALUES)
    .enter()
    .append("g")

legend.append("rect")
    .attr("fill", legcolor)
    .attr("width", 20)
    .attr("height", window.innerWidth - 20)
    .attr("y", function (d, i) {
        return 50 + (i * legspacing - 60);
    })
    .attr("x", 1000);

legend.append("text")
    .attr("class", "label")
    .attr("y", function (d, i) {
        return 50 + (i * legspacing - 46);
    })
    .attr("x", 1030)
    .attr("text-anchor", "start")
    .text(function (d, i) {
        return LABELS[i];
    });*/

var title = "Population at Risk"
//map.remove()

svg = d3.select("#graph")
    //.selectAll("g > *").remove()
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
        return 20 + (i * legspacing - 60);
    })
    .attr("x", window.innerWidth * 0.7 - 170);

legend.append("text")
    .attr("class", "label")
    .attr("y", function (d, i) {
        return 20 + (i * legspacing - 46);
    })
    .attr("x", window.innerWidth * 0.7 - 145)
    .attr("text-anchor", "start")
    .text(function (d, i) {
        return LABELS[i];
    });


function readCsv(filename) {

    //d3.selectAll("#graph").remove();
    //d3.selectAll("g > *").remove()
    //d3.select("g.parent").selectAll("*").remove();
    //d3.selectAll("div").append("#graph");
    //d3.selectAll("svg").remove();
    //map.invalidateSize();
    //createMap();
    //counties.addTo(map);

    //button();

    // Parse the Data
    d3.csv(filename, function (data) {
        console.log(filename);
        // append the svg object to the body of the page
        //d3.selectAll("g > *").remove()

        /*svg = d3.select("#graph")
            //.selectAll("g > *").remove()
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");*/

        // List of subgroups = header of the csv files = soil condition here
        var subgroups = data.columns.slice(1)

        // List of groups = species here = value of the first column called group -> I show them on the X axis
        var groups = d3.map(data, function (d) { return (d.scenario) }).keys()

        console.log(groups)
        console.log(window.innerWidth)

        svg.append("rect")
            .attr("x", -100)
            .attr("y", -100)
            .attr("width", width+150)
            .attr("height", height+150)
            .attr("fill", "#E2FFFC")

        // Add X axis
        var x = d3.scaleBand()
            .domain(groups)
            .range([0, width])
            .padding([0.2])
        svg.append("g")
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
                return 20 + (i * legspacing - 60);
            })
            .attr("x", window.innerWidth * 0.7 - 170);

        legend.append("text")
            .attr("class", "label")
            .attr("y", function (d, i) {
                return 20 + (i * legspacing - 46);
            })
            .attr("x", window.innerWidth * 0.7 - 145)
            .attr("text-anchor", "start")
            .text(function (d, i) {
                return LABELS[i];
            });

    })

};


// update function:
//function update(source) {
//    d3.selectAll(source + ".csv").transition().duration(1000);
//}
//function button() {
d3.selectAll('.selector')
    .on('click', function (d) {

        readCsv(this.id + ".csv");
        title = this.value
        //console.log(this.value);
        //createMap();
    });
//}
//createMap();
readCsv("population-at-risk.csv");

