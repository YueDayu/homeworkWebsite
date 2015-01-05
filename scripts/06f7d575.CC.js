var width  = 1000;
var height = 1000;

var pack = d3.layout.pack()
  .size([ width, height ])
  .radius(10);

var svg = d3.select("body").append("div")
  .attr("class", "pic")
  .style("width", width + "px")
  .style("margin-left", -width / 2 + "px")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", "translate(0,0)");

var list;

d3.json("json/CCList.json", function(error, res){
  list = res.thresholds;
});

loadData("json/CC1.100.json");

function onSliderChange() {
  var value = 0;
  value = document.getElementById("slider").value;
  document.getElementById("value").innerHTML = "阈值：" + value;
  var resvalue;
  for (var x in list) {
    if (value <= list[x].weight) {
      resvalue = list[x].weight;
    } else {
      break;
    }
  }
  var flag = 6;
  if (resvalue < 10) {
    flag = 5;
  }
  resvalue = resvalue.toString();
  while (resvalue.length < flag) {
    if (resvalue.length == 2 && flag == 6) {
      resvalue += ".";
    } else {
      resvalue += "0";
    }
  }
  d3.select("svg").remove();
  svg = d3.select("body").append("div")
    .attr("class", "pic")
    .style("width", width + "px")
    .style("margin-left", -width / 2 + "px")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(0,0)");
  var name = "json/CC/CC" + resvalue + ".json";
  loadData(name);
}

function loadData(name) {
  d3.json(name, function(error, root) {
    var nodes = pack.nodes(root);

    svg.selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      //.attr("class", function(d) {if (d.depth == 1) return "outCir";})
      .attr("fill",function(d) { if (d.depth < 1) return "rgb(255, 255, 255)"; return "rgb(31, 119, 180)";})
      .attr("fill-opacity","0.3")
      .attr("cx",function(d){
        return d.x;
      })
      .attr("cy",function(d){
        return d.y;
      })
      .attr("r",function(d){
        return d.r;
      })
      .on("mouseover",function(d,i){
        if (d.depth >= 2) {
          d3.select(this)
            .attr("fill", "yellow")
            .append("title")
            .text(function (d) {
              return d.name;
            });
        }
      })
      .on("mouseout",function(d,i){
        if (d.depth >= 2) {
          d3.select(this)
            .transition()
            .attr("fill", "rgb(31, 119, 180)");
        }
      });
  });
}
