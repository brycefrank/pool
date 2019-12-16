import * as d3 from 'd3';
import { layoutTextLabel, layoutGreedy,
    layoutLabel, layoutRemoveOverlaps } from '@d3fc/d3fc-label-layout';
import { geoProjection } from 'd3';

export function CumulativeWins(player_summary, current_week) {
    var margin = {top: 10, right: 60, bottom: 30, left: 60}
    var width = 460 - margin.left - margin.right
    var height = 400 - margin.top - margin.bottom;

    var svg = d3.select("#line_plot")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear()
        .domain([1, current_week])
        .range([0, width])

    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add tooltip
    var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, 30])
        .range([ height, 0 ]);
      svg.append("g")
        .call(d3.axisLeft(y));

    // Stuff for labeling
    const textLabel = layoutTextLabel()
        .value(function(d){return(d.key)})
    const strategy = layoutGreedy()
        .bounds({x:x(current_week), y:0, width:margin.right, height:height})
    const labelPadding = 4;
    const labels = layoutLabel(strategy)
        .size(function(d, i, g) {
            const textSize = g[i].getElementsByTagName('text')[0].getBBox()
            return [textSize.width + labelPadding, textSize.height + labelPadding*2]
        })
        .position(d => [x(current_week), y(d3.max(d.values[0]["cumulative_wins"]))])
        .component(textLabel)

    var color = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(['H1', 'H2', 'P1', 'P2', 'T1', 'T2'])

    var valueLine = d3.line()
        .x(function(d,i) {return x(i+1)})
        .y(function(d) {return y(d)})

    this.erase_lines = function() {
        svg.selectAll(".line")
        .remove()
    }

    this.draw_lines = function(player_summary) {
        var nest = d3.nest()
            .key(function(d){
                return d.name;
            })
            .entries(player_summary);

        svg
            .selectAll(".line")
            .data(nest)
            .enter()
            .append("path")
                .attr("class", "line")
                .attr("fill", "none")
                .attr("stroke", function(d){
                    return(color(d.values[0]["team"]))
                })
                .attr("stroke-width", 1.5)
                .attr("d", function(d){
                    return valueLine(d.values[0]["cumulative_wins"]);
                })
                .on("mouseover", function(d){
                    div.html(d.key)
                    div.transition()		
                    .duration(20)		
                    .style("opacity", .9)
                    div	.html(d.key)	
                    .style("left", (d3.event.pageX) + "px")		
                    .style("top", (d3.event.pageY - 28) + "px");	
                })
                .on("mouseout", function(d) {		
                    div.transition()		
                    .duration(500)		
                    .style("opacity", 0);	
            });
        svg
            .datum(nest)
            .call(labels)
            .selectAll("rect")
            .attr("fill", "none")
    }
}