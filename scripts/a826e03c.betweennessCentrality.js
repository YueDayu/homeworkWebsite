var width = 1200,
  height = 1200;

var numList = [0, 10, 100, 1000, 2000, 4000, 6000, 8000, 11000, 13000, 10000000];
var color = ["#f3e5f5", "#e1bee7", "#ce93d8", "#ba68c8", "#ab47bc", "#9c27b0", "#8e24aa", "#7b1fa2", "#6a1ba2", "#4a148c"];

function getColor(i) {
  var result;
  for (var x in numList) {
    if (i >= numList[x]) {
      result = color[x];
    } else {
      return result;
    }
  }
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

d3.json("json/Centrality.json", function(error, graph) {
  force
    .nodes(graph.nodes)
    .start();

  var node = svg.selectAll(".node")
    .data(graph.nodes)
    .enter().append("circle")
    .attr("class", "node")
    .attr("r", 8)
    .style("fill", function(d) { return getColor(parseInt(d.Betweeness)); })
    .call(force.drag);

  node.append("title")
    .text(function(d) { return (d.name + "号介数中心度：" + d.Betweeness); });

  force.on("tick", function() {
    node.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
  });
});


