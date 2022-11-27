function setMap() {
    //map frame dimensions
    var width = window.innerWidth * 0.5,
        height = 460;

    //create new svg container for the map
    var map = d3
        .select("body")
        .append("svg")
        .attr("class", "map")
        .attr("width", width)
        .attr("height", height);

    //create Albers equal area conic projection centered on France
    var projection = d3
        .geoAlbers()
        .center([0, 46.2])
        .rotate([-2, 0, 0])
        .parallels([43, 62])
        .scale(2500)
        .translate([width / 2, height / 2]);

    var path = d3.geoPath().projection(projection);

    //use Promise.all to parallelize asynchronous data loading
    var promises = [
        d3.csv("data/Florida.csv"),
        d3.json("data/FloridaCounties.geojson"),
    ];
    Promise.all(promises).then(callback);

    function callback(data) {
        var csvData = data[0],
            counties = data[1];

        //join csv data to GeoJSON enumeration units
        counties = joinData(counties, csvData);

        setChart();
    }
}

function joinData(counties, csvData) {
    //loop through csv to assign each set of csv attribute values to geojson region
    for (var i = 0; i < csvData.length; i++) {
        var csvRegion = csvData[i]; //the current region
        var csvKey = csvRegion.FIPS; //the CSV primary key

        //loop through geojson regions to find correct region
        for (var a = 0; a < counties.length; a++) {

            var geojsonProps = counties[a].properties; //the current region geojson properties
            var geojsonKey = geojsonProps.FIPS; //the geojson primary key

            //where primary keys match, transfer csv data to geojson properties object
            if (geojsonKey == csvKey) {

                //assign all attributes and values
                attrArray.forEach(function (attr) {
                    var val = parseFloat(csvRegion[attr]); //get csv attribute value
                    geojsonProps[attr] = val; //assign attribute and value to geojson properties
                });
            };
        };
    };
    return counties;
};
//function to create coordinated bar chart
function setChart() {

    // set the dimensions and margins of the graph
    const margin = { top: 30, right: 30, bottom: 70, left: 60 },
        width = window.innerWidth * 0.7 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select("#map")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Initialize the X axis
    const x = d3.scaleBand()
        .range([0, width])
        .padding(0.2);
    const xAxis = svg.append("g")
        .attr("transform", `translate(0,${height})`);

    // Initialize the Y axis
    const y = d3.scaleLinear()
        .range([height, 0]);
    const yAxis = svg.append("g")
        .attr("class", "myYaxis");


    // A function that create / update the plot for a given variable:
    this.update = function(selectedVar) {

        // Parse the Data
        d3.csv("data/Florida1.csv").then(function (data) {

            // X axis
            x.domain(data.map(d => d.Name));
            xAxis.transition().duration(1000).call(d3.axisBottom(x));

            // Add Y axis
            y.domain([0, 100]);
            yAxis.transition().duration(1000).call(d3.axisLeft(y));

            // variable u: map data to existing bars
            const u = svg.selectAll("rect")
                .data(data)

            // update bars
            u.join("rect")
                .transition()
                .duration(1000)
                .attr("x", d => x(d.Name))
                .attr("y", d => y(d[selectedVar]))
                .attr("width", x.bandwidth())
                .attr("height", d => height - y(d[selectedVar]))
                .attr("fill", "#69b3a2")
        })

    }

    // Initialize plot
    update('var1')
};

window.onload = setMap();