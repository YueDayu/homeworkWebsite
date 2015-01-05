function allowedNum() {
  if(!(event.keyCode==46)&&!(event.keyCode==8)&&!(event.keyCode==37)&&!(event.keyCode==39)) {
    if (!((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105))) {
      event.returnValue = false;
    }
  }
}

var start = document.getElementById('startPoint');
var end = document.getElementById('endPoint');
var result = document.getElementById('result');

function calculate() {
  console.log(start.value);
  if (start.value == "" || end.value == "") {
    alert("请输入数字");
    return;
  }
  var startValue = parseInt(start.value);
  var endValue = parseInt(end.value);
  if (startValue > 970 || endValue > 970) {
    alert("输入数字请小于970");
    return;
  }
  var resultPath = "", resultWeight = 0;
  d3.json(("json/SP/shortpath" + startValue + ".json"), function(err, res){
    if (err) {
      alert("查询失败");
      return;
    }
    for (var x in res.nodes) {
      if (res.nodes[x].name == endValue) {
        resultPath = res.nodes[x].path;
        resultWeight = res.nodes[x].weight;
        break;
      }
    }
    if (resultPath == "" || resultWeight == 0) {
      document.getElementById("result").value = "没有路径";
    } else {
      document.getElementById("result").value = "路径：[" + resultPath + "] 长度：" + resultWeight;
    }
  });
}
