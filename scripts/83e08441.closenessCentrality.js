var width = 1200,
  height = 1200;

var numList = [0, 2000, 2100, 2200, 2300, 2500, 2800, 3200, 3500, 4000, 1000000];
var color = ["#fde0dc", "#f9bdbb", "#f69988", "#f36c60", "#e84e40", "#e51c23", "#dd191d", "#d01716", "#c41411", "#b0120a"];

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
    .style("fill", function(d) { return getColor(parseInt(d.Closeness)); })
    .call(force.drag);

  node.append("title")
    .text(function(d) { return (d.name + "号紧密中心度：" + d.Closeness); });

  force.on("tick", function() {
    node.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
  });
});


