import * as d3 from 'd3';

export function plot_cumulative_wins(player_summary, current_week) {
    var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    var svg = d3.select("#line_plot")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear()
        .domain([1,current_week])
        .range([0, width])

    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));


    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, 30])
        .range([ height, 0 ]);
      svg.append("g")
        .call(d3.axisLeft(y));

    var nest = d3.nest()
        .key(function(d){
            return d.name;
        })
        .entries(player_summary);

    var valueLine = d3.line()
        .x(function(d,i) {return x(i+1)})
        .y(function(d) {return y(d)})
    
    console.log(nest)

    svg
        .selectAll(".line")
        .data(nest)
        .enter()
        .append("path")
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 1.5)
            .attr("d", function(d){
                return valueLine(d.values[0]["cumulative_wins"]);
            })
        
}