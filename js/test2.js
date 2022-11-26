states = d3.csv("data/Florida.csv")

//console.log(states)

let ages = [
    "Homes at Risk",
    "Value at Risk",
    "Property Tax at Risk",
    "Population at Risk"
]

//ages = d3.keys(states[1]).filter

let stateages = [{
    county: "Broward-Low",
    factor: "Homes at Risk",
    percentage: "0.02"
}, {
    county: "Collier-Low",
    factor: "Homes at Risk",
    percentage: "0.17"
}, {
    county: "Miami-Dade-Low",
    factor: "Homes at Risk",
    percentage: "2.85"
}, {
    county: "Monroe-Low",
    factor: "Homes at Risk",
    percentage: "19.28"
}, {
    county: "Palm Beach-Low",
    factor: "Homes at Risk",
    percentage: "0.62"
}, {
    county: "Broward-Med",
    factor: "Homes at Risk",
    percentage: "0.07"
}, {
    county: "Collier-Med",
    factor: "Homes at Risk",
    percentage: "0.25"
}, {
    county: "Miami-Dade-Med",
    factor: "Homes at Risk",
    percentage: "16.79"
}, {
    county: "Monroe-Med",
    factor: "Homes at Risk",
    percentage: "47.62"
}, {
    county: "Palm Beach-Med",
    factor: "Homes at Risk",
    percentage: "5.10"
}, {
    county: "Broward-High",
    factor: "Homes at Risk",
    percentage: "0.13"
}, {
    county: "Collier-High",
    factor: "Homes at Risk",
    percentage: "0.39"
}, {
    county: "Miami-Dade-High",
    factor: "Homes at Risk",
    percentage: "61.81"
}, {
    county: "Monroe-High",
    factor: "Homes at Risk",
    percentage: "85.66"
}, {
    county: "Palm Beach-High",
    factor: "Homes at Risk",
    percentage: "13.41"
}, {
    county: "Broward-Low",
    factor: "Value at Risk",
    percentage: "0.04"
}, {
    county: "Collier-Low",
    factor: "Value at Risk",
    percentage: "0.08"
}, {
    county: "Miami-Dade-Low",
    factor: "Value at Risk",
    percentage: "3.22"
}, {
    county: "Monroe-Low",
    factor: "Value at Risk",
    percentage: "19.98"
}, {
    county: "Palm Beach-Low",
    factor: "Value at Risk",
    percentage: "1.39"
}, {
    county: "Broward-Med",
    factor: "Value at Risk",
    percentage: "0.09"
}, {
    county: "Collier-Med",
    factor: "Value at Risk",
    percentage: "0.20"
}, {
    county: "Miami-Dade-Med",
    factor: "Value at Risk",
    percentage: "19.06"
}, {
    county: "Monroe-Med",
    factor: "Value at Risk",
    percentage: "54.32"
}, {
    county: "Palm Beach-Med",
    factor: "Value at Risk",
    percentage: "10.28"
}, {
    county: "Broward-High",
    factor: "Value at Risk",
    percentage: "0.21"
}, {
    county: "Collier-High",
    factor: "Value at Risk",
    percentage: "0.28"
}, {
    county: "Miami-Dade-High",
    factor: "Value at Risk",
    percentage: "61.93"
}, {
    county: "Monroe-High",
    factor: "Value at Risk",
    percentage: "85.39"
}, {
    county: "Palm Beach-High",
    factor: "Value at Risk",
    percentage: "25.83"
}]

//stateages = ages.flatMap(age => states.map(d => ({ state: d.name, age, population: d[age] }))) // pivot longer

chart = GroupedBarChart(stateages, {
    x: d => d.state,
    y: d => d.population / 1e6,
    z: d => d.age,
    //xDomain: d3.groupSort(stateages, D => d3.sum(D, d => -d.population), d => d.state).slice(0, 6), // top 6
    xDomain: d3.rollups(stateages, group => d3.sum(group, d => d.population), d => d.state)
    .sort(([, a], [, b]) => d3.ascending(a, b))
    .map(([key]) => key),
    yLabel: "↑ Population (millions)",
    zDomain: ages,
    colors: d3.schemeSpectral[ages.length],
    width: 600,
    height: 500
})

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/grouped-bar-chart
function GroupedBarChart(data, {
    x = (d, i) => i, // given d in data, returns the (ordinal) x-value
    y = d => d, // given d in data, returns the (quantitative) y-value
    z = () => 1, // given d in data, returns the (categorical) z-value
    title, // given d in data, returns the title text
    marginTop = 30, // top margin, in pixels
    marginRight = 0, // right margin, in pixels
    marginBottom = 30, // bottom margin, in pixels
    marginLeft = 40, // left margin, in pixels
    width = 640, // outer width, in pixels
    height = 400, // outer height, in pixels
    xDomain, // array of x-values
    xRange = [marginLeft, width - marginRight], // [xmin, xmax]
    xPadding = 0.1, // amount of x-range to reserve to separate groups
    yType = d3.scaleLinear, // type of y-scale
    yDomain, // [ymin, ymax]
    yRange = [height - marginBottom, marginTop], // [ymin, ymax]
    zDomain, // array of z-values
    zPadding = 0.05, // amount of x-range to reserve to separate bars
    yFormat, // a format specifier string for the y-axis
    yLabel, // a label for the y-axis
    colors = d3.schemeTableau10, // array of colors
} = {}) {
    // Compute values.
    const X = d3.map(data, x);
    const Y = d3.map(data, y);
    const Z = d3.map(data, z);

    // Compute default domains, and unique the x- and z-domains.
    if (xDomain === undefined) xDomain = X;
    if (yDomain === undefined) yDomain = [0, d3.max(Y)];
    if (zDomain === undefined) zDomain = Z;
    xDomain = new d3.InternSet(xDomain);
    zDomain = new d3.InternSet(zDomain);

    // Omit any data not present in both the x- and z-domain.
    const I = d3.range(X.length).filter(i => xDomain.has(X[i]) && zDomain.has(Z[i]));

    // Construct scales, axes, and formats.
    const xScale = d3.scaleBand(xDomain, xRange).paddingInner(xPadding);
    const xzScale = d3.scaleBand(zDomain, [0, xScale.bandwidth()]).padding(zPadding);
    const yScale = yType(yDomain, yRange);
    const zScale = d3.scaleOrdinal(zDomain, colors);
    const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
    const yAxis = d3.axisLeft(yScale).ticks(height / 60, yFormat);

    // Compute titles.
    if (title === undefined) {
        const formatValue = yScale.tickFormat(100, yFormat);
        title = i => `${X[i]}\n${Z[i]}\n${formatValue(Y[i])}`;
    } else {
        const O = d3.map(data, d => d);
        const T = title;
        title = i => T(O[i], i, data);
    }

    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(yAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", width - marginLeft - marginRight)
            .attr("stroke-opacity", 0.1))
        .call(g => g.append("text")
            .attr("x", -marginLeft)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text(yLabel));

    const bar = svg.append("g")
        .selectAll("rect")
        .data(I)
        .join("rect")
        .attr("x", i => xScale(X[i]) + xzScale(Z[i]))
        .attr("y", i => yScale(Y[i]))
        .attr("width", xzScale.bandwidth())
        .attr("height", i => yScale(0) - yScale(Y[i]))
        .attr("fill", i => zScale(Z[i]));

    if (title) bar.append("title")
        .text(title);

    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(xAxis);

    return Object.assign(svg.node(), { scales: { color: zScale } });
}

//window.onload = chart;

/*import {Legend, Swatches} from "@d3/color-legend"
import {howto, altplot} from "@d3/example-components"
import * as d3 from "d3";*/
