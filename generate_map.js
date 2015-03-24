define([
  './matrix'
],function(
  matrix
){
  return function ( map, options ){
    // return
    var options = {
      left       : 10,
      width      : options.width || 665,
      top        : 20,
      height     : options.height || 195,
      position   : 'absolute',
      background : '#aaa'
    };

    var thin = options.thin || 2;
    var block = options.block || Math.min(
                   Math.floor(options.width  / map.width),
                   Math.floor(options.height / map.height));

    // var $domain = $('<div></div>')
    //                 .css(options)
    //                 .appendTo('.maze');

    function draw_line_horizontal ( x, y, opt ){
      opt = opt || {};
      $('<div class="thinwalls"></div>')
        .css({
          top : options.top + y*block - thin/2 + block/2,
          left :  opt.left || options.left + (x-1)*block - thin/2 + block/2,
          width : opt.width || block + thin,
          height : thin
        })
        .appendTo('.maze')
    }
    function draw_line_vertical ( x, y, opt ){
      opt = opt || {};
      $('<div class="thinwalls"></div>')
        .css({
          top : opt.top || options.top + (y-1)*block - thin/2 + block/2 ,
          left : options.left + x*block - thin/2 + block/2,
          width : thin,
          height : opt.height || block + thin
        })
        .appendTo('.maze')
    }

    function draw_road ( x, y ){
      return;
      $('<div></div>')
        .css({
          top        : options.top + y*block,
          left       : options.left + x*block,
          width      : block,
          height     : block,
          background : 'black',
          opacity    : 0.5,
          position   : 'absolute'
        })
        .appendTo('.maze')
    }
    var connectors = [];
    var ends  = [];

    var data_matrix = new matrix( map.width, map.height );
    var wall_matrix = new matrix( map.width, map.height );
    data_matrix.matrix = map.total;

    var prev_idx;
    var left_is_wall;
    function update_wall_matrix_idx( idx, key, val ){
      var data = wall_matrix.get(idx) || {};
      data[key] = val;
      wall_matrix.set(idx,data);
    }
    // 绘制水平的墙
    data_matrix.walk_rows(function( is_road, idx, col, row ) {
      if( is_road ){
        draw_road(col,row);
      }
      if( !col ){
      } else {
        if( left_is_wall && !is_road ){
          if( col == 1 ){
            update_wall_matrix_idx(prev_idx, 'connect_right', true);
          }
          update_wall_matrix_idx(idx, 'connect_left', true);

          draw_line_horizontal(col,row);
        }
      }
      prev_idx = idx;
      left_is_wall = !is_road;
    });
    // 绘制竖直的墙
    var top_is_wall;
    data_matrix.walk_cols(function( is_road, idx, col, row ) {
      if( !row ){
      } else {
        if( top_is_wall && !is_road ){
          if( row == 1 ){
            update_wall_matrix_idx(prev_idx,'connect_down',true);
          }
          update_wall_matrix_idx(idx,'connect_top',true);
          draw_line_vertical(col,row);
        }
      }
      prev_idx = idx;
      top_is_wall = !is_road;
    });
    // 将临近边缘上的点链接到边缘
    var wall_data;

    var patch_len = thin/2 + block/2;
    var edge_top = options.top;
    var edge_down_top = options.top + (map.height-1)*block - thin/2 + block/2;
    var edge_left = options.left;
    var edge_rigth_left = options.left + (map.width -1)*block - thin/2 + block/2;

    for(var i = 0; i < wall_matrix.width; i ++ ){
      if( !data_matrix.get(i,0) ){
        wall_data = wall_matrix.get(i,0);
        if( wall_data && wall_data.connect_down ){
          draw_line_vertical(i,0,{
            top    : edge_top,
            height : patch_len
          });
        }
      }
      if( !data_matrix.get(i,map.height -1) ){
        wall_data = wall_matrix.get(i,map.height -1);
        if( wall_data && wall_data.connect_top){
          draw_line_vertical(i,map.height -1,{
            top    : edge_down_top,
            height : patch_len
          });
        }
      }
    }
    for(var j = 0; j < wall_matrix.height; j++ ){
      if( !data_matrix.get(0,j) ){
        wall_data = wall_matrix.get(0,j);
        if( wall_data && wall_data.connect_right ){
          draw_line_horizontal(0,j,{
            left  : edge_left,
            width : patch_len
          });
        }
      }
      if( !data_matrix.get( map.width - 1, j ) ){
        wall_data = wall_matrix.get( map.width - 1, j );
        if( wall_data && wall_data.connect_left ){
          draw_line_horizontal( map.width - 1, j ,{
            left  : edge_rigth_left,
            width : patch_len
          });
        }
      }
    }
  }
});