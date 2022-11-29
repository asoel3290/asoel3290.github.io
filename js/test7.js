// set the dimensions and margins of the graph
const margin = { top: 30, right: 30, bottom: 70, left: 60 },
    width = window.innerWidth * 0.8 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

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

var csvData;

d3.csv("data/Florida1.csv", function (data) {
    csvData = data;
});
setTimeout(function () {
    console.log(csvData);
}, 200);

// Parse the Data
d3.csv("data/Florida1.csv").then(function (data) {
    // List of groups (here I have one group per column)
    var allGroup = ["var1", "var2", "var3", "var4"]

    // add the options to the button
    d3.select("#selectButton")
        .selectAll('myOptions')
        .data(allGroup)
        .enter()
        .append('option')
        .text(function (d) { return d; }) // text showed in the menu
        .attr("var", function (d) { return d; }) // corresponding value returned by the button

    // A function that create / update the plot for a given variable:
    function update(selectedVar) {

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
    }


    // Initialize plot
    // When the button is changed, run the updateChart function
    d3.select("#selectButton").on("change", function (d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("var")
        // run the updateChart function with this selected option
        update(selectedOption)
    })
})