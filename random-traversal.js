function n() {
  var n = ++g;
  M.clearRect(0, 0, d, u), 
  M.fillStyle = "white", 
  m.classed("animation--playing", !0), 
  a = new Array(x * y), 
  o = [];

  var e = (y - 1) * x;
  a[e] = 0, 
  i(e), 
  o.push({
    index: e,
    direction: c
  }), 
  o.push({
    index: e,
    direction: s
  }), 
  d3.timer(function() {
    if (n !== g) return !0;
    for (var i, e = 0; ++e < 10 && !(i = t()););
    return i && m.classed("animation--playing", !1)
  })
}

function t() {
  if (null == (n = r(o))) return !0;
  var n, t, d, u, p = n.index,
    v = n.direction,
    g = p + (v === c ? -x : v === f ? x : v === h ? -1 : 1),
    m = p % x,
    w = p / x | 0,
    R = null == a[g];
  M.fillStyle = R ? "white" : "black",
  v === c ? (l(g), t = m, d = w - 1, u = f) : 
  v === f ? (l(p), t = m, d = w + 1, u = c) : 
  v === h ? (e(g), t = m - 1, d = w, u = s) : 
            (e(p), t = m + 1, d = w, u = h),

  if(R){
    i(g), 
    a[p] |= v,
    a[g] |= u,
    M.fillStyle = "red", 
    if( d > 0 && null == a[g - x] ){
      l(g - x), 
      o.push({
        index: g,
        direction: c
      })
    }
    if( y - 1 > d && null == a[g + x] ){
      l(g), 
      o.push({
        index: g,
        direction: f
      });
    }
    if( t > 0 && null == a[g - 1] ){
      e(g - 1), 
      o.push({
        index: g,
        direction: h
      });
    }
    if( x - 1 > t && null == a[g + 1] ){
      e(g), 
      o.push({
        index: g,
        direction: s
      })
    }
  }
}

function i(n) {
  var t = n % x,
    i = n / x | 0;
  M.fillRect(t * p + (t + 1) * v, i * p + (i + 1) * v, p, p)
}

function e(n) {
  var t = n % x,
    i = n / x | 0;
  M.fillRect((t + 1) * (p + v), i * p + (i + 1) * v, v, p)
}

function l(n) {
  var t = n % x,
    i = n / x | 0;
  M.fillRect(t * p + (t + 1) * v, (i + 1) * (p + v), p, v)
}
// random_pop
function r(n) {
  if (n.length) {
    var t, i = n.length,
      e = Math.random() * i | 0;
    return t = n[e], n[e] = n[i - 1], n[i - 1] = t, n.pop()
  }
}
var a, o, d = 960,
  u = 500,
  c = 1,
  f = 2,
  h = 4,
  s = 8,
  p = 6,
  v = 6,
  x = Math.floor((d - v) / (p + v)),
  y = Math.floor((u - v) / (p + v)),
  g = 0,
  m = d3.select("#random-traversal").on("click", n),
  w = m.append("canvas").attr("width", d).attr("height", u);
m.append("button").text("▶ Play"), whenFullyVisible(m.node(), n);
var M = w.node().getContext("2d");
M.translate(Math.round((d - x * p - (x + 1) * v) / 2), Math.round((u - y * p - (y + 1) * v) / 2))
