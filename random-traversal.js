function n() {
  var c_animate_index = ++g_animate_index;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "white";
  m.classed("animation--playing", !0);
  all_nodes = new Array(x_count * y_count);
  nodes = [];

  var e = (y_count - 1) * x_count;
  all_nodes[e] = 0;
  draw_road_cross(e);

  nodes.push({
    index: e,
    direction: up
  });
  nodes.push({
    index: e,
    direction: right
  });
  d3.timer(function() {
    // g_animate_index被修改说明当前动画被废弃。
    if (c_animate_index !== g_animate_index) return !0;
    // 每次循环跑10个
    for (var i, e = 0; ++e < 10 && !(i = search_for_road());){
      'pass';
    }
    // 如果全结束了就表示为停止动画
    return i && m.classed("animation--playing", !1)
  })
}

function search_for_road() {
  if ( null == (n = random_pop(nodes)) ){
    // 没有节点就退出
   return !0;
 }
  var n, t, d, u, p = n.index,
    v = n.direction,
    g = p + ( v === up ? -x_count 
            : v === down ? x_count 
            : v === left ? -1 
                      : 1),
    m = p % x_count,
    w = p / x_count | 0,
    R = null == all_nodes[g];

  ctx.fillStyle = R ? "white" : "black";

  v === up   ? (draw_road_vertical(g), t = m, d = w - 1, u = down) : 
  v === down ? (draw_road_vertical(p), t = m, d = w + 1, u = up) : 
  v === left ? (draw_road_horizontal(g), t = m - 1, d = w, u = right) : 
               (draw_road_horizontal(p), t = m + 1, d = w, u = left);

  if(R){
    draw_road_cross(g);
    all_nodes[p] |= v;
    all_nodes[g] |= u;
    ctx.fillStyle = "red";
    if( d > 0 && null == all_nodes[g - x_count] ){
      draw_road_vertical(g - x_count);
      nodes.push({
        index: g,
        direction: up
      })
    }
    if( y_count - 1 > d && null == all_nodes[g + x_count] ){
      draw_road_vertical(g);
      nodes.push({
        index: g,
        direction: down
      });
    }
    if( t > 0 && null == all_nodes[g - 1] ){
      draw_road_horizontal(g - 1);
      nodes.push({
        index: g,
        direction: left
      });
    }
    if( x_count - 1 > t && null == all_nodes[g + 1] ){
      draw_road_horizontal(g);
      nodes.push({
        index: g,
        direction: right
      })
    }
  }
}

function draw_road_cross(n) {
  // x position
  var t = n % x_count,
  // y position
    i = n / x_count | 0;
  ctx.fillRect(t * road_width + (t + 1) * wall_width, i * road_width + (i + 1) * wall_width, road_width, road_width)
}

function draw_road_horizontal(n) {
  var t = n % x_count,
    i = n / x_count | 0;
  ctx.fillRect((t + 1) * (road_width + wall_width), i * road_width + (i + 1) * wall_width, wall_width, road_width)
}

function draw_road_vertical(n) {
  var t = n % x_count,
    i = n / x_count | 0;
  ctx.fillRect(t * road_width + (t + 1) * wall_width, (i + 1) * (road_width + wall_width), road_width, wall_width)
}
// random_pop
function random_pop(n) {
  if (n.length) {
    var t, i = n.length,
      e = Math.random() * i | 0;
    return t = n[e], n[e] = n[i - 1], n[i - 1] = t, n.pop()
  }
}
var all_nodes, 
nodes,

width = 960,
height = 500,
// 四个方向上下左右
up = 1,
down = 2,
left = 4,
right = 8,

// 猜不出 一个是墙壁的宽度一个是格子的宽度?
road_width = 6,
// 于是v是墙壁的宽度
wall_width = 6,
// 一共多少列
x_count = Math.floor((width - wall_width) / (road_width + wall_width)),
// 一共是多少行
y_count = Math.floor((height - wall_width) / (road_width + wall_width)),

g_animate_index = 0,

m = d3.select("#random-traversal").on("click", n),
w = m.append("canvas")
      .attr("width", width)
      .attr("height", height);

m.append("button").text("▶ Play");

whenFullyVisible(m.node(), n);

var ctx = w.node().getContext("2d");
// 让canvas居中
ctx.translate(Math.round((width - x_count * road_width - (x_count + 1) * wall_width) / 2), 
              Math.round((height - y_count * road_width - (y_count + 1) * wall_width) / 2))
