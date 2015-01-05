var diameter = 1000;

var tree = d3.layout.tree()
  .size([360, diameter / 2 - 50])
  .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

var diagonal = d3.svg.diagonal.radial()
  .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

var zoom = d3.behavior.zoom()
  .scaleExtent([1, 10])
  .on("zoom", zoomed);

var sum = 0;

function zoomed() {
  console.log(d3.event.scale);
  svg.attr("transform",
    "translate(" + (d3.event.translate[0] + (diameter / 2 - 50)) + "," + (d3.event.translate[1] + (diameter / 2 - 100)) + ")scale(" + d3.event.scale + ")");
  svg.select("rect")
    .attr("x", (50 - diameter / 2) - d3.event.translate[0])
    .attr("y", (100 - diameter / 2) - d3.event.translate[1])
    .attr("transform", "scale(" + (1 / d3.event.scale) + ")");
}

var svg = d3.select("body").append("div")
  .attr("class", "pic")
  .style("width", diameter + "px")
  .style("margin-left", -diameter / 2 + "px")
  .append("svg")
  .attr("width", diameter)
  .attr("height", diameter - 300)
  .append("g")
  .attr("transform", "translate(" + (diameter / 2 - 50) + "," + (diameter / 2 - 100) + ")")
  .call(zoom);

svg.append('rect')
  .attr("x" , (50 - diameter / 2))
  .attr("y", (100 - diameter / 2))
  .attr("width", "1000")
  .attr("height", "1000")
  .attr("fill", "#eee");

d3.json("json/MST_2.json", function(error, root) {
  var nodes = tree.nodes(root),
    links = tree.links(nodes);

  console.log(links);
  for (var x in links) {
    sum += links[x].target.size * 10;
  }
  document.getElementById("value").innerHTML = "最小生成树权值："  + (sum / 10).toString();

  var link = svg.selectAll(".link")
    .data(links)
    .enter().append("path")
    .attr("class", "link")
    .attr("d", diagonal);

  var node = svg.selectAll(".node")
    .data(nodes)
    .enter().append("g")
    .attr("class", "node")
    .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; });

  node.append("circle")
    .attr("r", 4.5)
    .on("mouseover", fade(1))
    .on("mouseout", fade(0));

  function fade(opacity) {
    return function(g, i) {
      var temp = svg.selectAll(".node")
        .filter(function(d, j) {return j == i;});
      temp.transition()
        .select("circle")
        .style("fill", opacity > 0.5 ? "#f00" : "#fff");
      svg.selectAll(".link")
        .filter(function(d) {return d.source == g;})
        .transition()
        .style("stroke", opacity > 0.5 ? "#f44" : "#bbb");
      svg.selectAll(".link")
        .filter(function(d) {return d.target == g;})
        .transition()
        .style("stroke", opacity > 0.5 ? "#000" : "#bbb");
      svg.selectAll(".node")
        .filter(function(d) {return d.parent == g;})
        .transition()
        .select("circle")
        .style("fill", opacity > 0.5 ? "#f00" : "#fff");
      svg.selectAll(".node")
        .filter(function(d) {
          for (var x in d.children) {
            if (d.children[x] == g) {
              return true;
            }
          }
          return false;})
        .transition()
        .select("circle")
        .style("fill", opacity > 0.5 ? "#000" : "#fff");
      if (opacity > 0.5) {
        temp.append("text")
          .attr("dy", ".31em")
          .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
          .attr("transform", function(d) { return d.x < 180 ? "translate(4)" : "rotate(180)translate(-4)"; })
          .text(function(d) { return d.name; });
      } else {
        temp.select('text')
          .remove();
      }
      node.append("title")
        .text(function(d) { return d.name; });
    };
  }
  //node.attr("title", "d");
});

d3.select(self.frameElement).style("height", diameter - 150 + "px");
