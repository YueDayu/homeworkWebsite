var width = 1200,
  height = 1200;

function getColor(i) {
  var r = 180 - i * 20;
  var g = 56 + i * 10;
  var b = 56 + i * 10;
  return "rgb(" + r + "," + g + "," + b + ")";
}

var force = d3.layout.force()
  .charge(-20)
  .linkDistance(10)
  .size([width, height]);

var svg = d3.select("body").append("div")
  .attr("class", "pic")
  .style("width", width + "px")
  .style("margin-left", -width / 2 + "px")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

var sum = 0.0;

d3.json("json/MST_L.json", function(error, graph) {
  force
    .nodes(graph.nodes)
    .links(graph.links)
    .start();

  var link = svg.selectAll(".link")
    .data(graph.links)
    .enter().append("line")
    .attr("class", "link")
    .style("stroke-width", function(d) { return Math.sqrt(d.value); });

  for (var x in graph.links) {
    sum += graph.links[x].value * 1000;
  }
  document.getElementById("value").innerHTML = "最大生成树权值："  + (sum / 1000).toString();

  var node = svg.selectAll(".node")
    .data(graph.nodes)
    .enter().append("circle")
    .attr("class", "node")
    .attr("r", 5)
    .style("fill", function(d) { return getColor(d.weight); })
    .call(force.drag);

  node.append("title")
    .text(function(d) { return d.name; });

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
  });
});


