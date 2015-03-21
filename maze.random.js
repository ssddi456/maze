require([
  './person',
  './maze_walls',
  'jquery',
  'gamelibs/animates',
  'gamelibs/mover',
  'gamelibs/source/timer',
  'gamelibs/collider',
  'gamelibs/collider_data',
  'gamelibs/collider_triggers'
],function(
  person,
  maze_walls,
  $,
  animates,
  mover,
  timer,
  collider,
  collider_data,
  collider_triggers
){
  var $maze =$('.maze');
  var options = {
                  position : 'absolute',
                  left : 10,
                  top  : 20,
                  width : 665,
                  height : 200,
                  opacity : 0.8,
                  background : '#aaa'
                };
  var domain = $('<div class="domain"></div>')
                  .appendTo($maze)
                  .css(options);
  var ceil = 7;
  var grid_x = Math.floor(options.width/ceil);
  var grid_y = Math.floor(options.height/ceil);
  var grid = [];
  var bg_b = '#333';
  var bg_w = '#eee';
  function create_ceil(x,y, color){
    return $('<div class="ceil"></div>')
      .appendTo($maze)
      .css({
        position : 'absolute',
        top : y*ceil + options.top,
        left : x*ceil + options.left,
        width : ceil,
        height : ceil,
        background : color || ((x+y)%2 ? bg_w : bg_b)
      })
  }
  var row;
  for(var j = 0; j < grid_y; j++){
    row = [];
    grid.push(row);
    for(var i = 0; i < grid_x; i++){
      row.push([i,j]);
      create_ceil(i,j);
    }
  }
  // 
  // [from:[x,y],to:[delta_x,delta_y]]
  // 
  var checkings = [];
  // {
  //  [x,y] : true
  // }
  var choosed = {};

  function choose( item ){
    var x = item[0];
    var y = item[1];
    choosed[x+','+y] = true;
    create_ceil( x, y,'blue');
  }
  function is_choosed( item ){
    var x = item[0];
    var y = item[1];
    return choosed[x+','+y];
  }
  function get_nearby_ceil( item ){
    var x = item[0];
    var y = item[1];
    return  [ 
              [ x, y-1],
              [ x-1, y],
              [ x+1, y],
              [ x, y+1]
            ].filter(function( item ){
              return get_ceil(item);
            });
  }
  function get_ceil( item ){
    var x = item[0];
    var y = item[1];
    return grid[y] && grid[y][x];
  }
  function add_checking( item ){
    var x = item[0];
    var y = item[1];
    var nearbys = get_nearby_ceil(item);
    nearbys.forEach(function(item){ 
      if( !is_choosed(item) ){
        checkings.push([
          [ x, y ], 
          [ item[0]-x, item[1]-y ], 
          create_ceil(item[0],item[1],'red')
        ]);
      }
    });
  }
  function remove_checking( checking ){
    checking[2].remove();
  }
  function random_idx (arr){
    return Math.floor(Math.random()*arr.length);
  }
  function random_item ( arr ){
    return arr[random_idx(arr)];
  }

  function random_pop ( arr ){
    var idx = random_idx(arr);
    var item = arr[idx];
    var last = arr[arr.length - 1];
    arr[arr.length-1] = item;
    arr[idx] = last;
    return arr.pop();
  }
  function expand_checking(checking){
    return {
      from           : checking[0],
      direction      : checking[1],
      to             : [
                        checking[0][0] + checking[1][0],
                        checking[0][1] + checking[1][1]
                      ],
      one_step_ahead : [
                          checking[0][0] + 2*checking[1][0],
                          checking[0][1] + 2*checking[1][1]
                       ]
    };
  }
  function grow_with ( checking ){
    checking = expand_checking(checking);
    if( can_grow(checking.one_step_ahead) ){
      choose(checking.to);
      choose(checking.one_step_ahead);
      add_checking(checking.one_step_ahead);
    }
  }
  function can_grow ( one_step_ahead ){
    if( !get_ceil(one_step_ahead) 
      || is_choosed(one_step_ahead)
    ){
      return false;
    }
    return true;
  }

  var start = [ 
                random_idx(grid[0]),
                grid.length - 1
              ];
  choose(start);
  add_checking(start)


  var interval = 100;
  setTimeout(function(){
    if(checkings.length){
      var checking = random_pop(checkings);
      grow_with(checking);
      remove_checking(checking);
      setTimeout(arguments.callee,interval)
    }
  },interval);

  // timer.mainLoop(function( delta_t ) {
  //   animates.forEach(function( wanderer ){
  //     if( !wanderer.dead ){
  //       mover( wanderer, delta_t );
  //     }
  //   });
  //   collider.mario_collide( animates );
  // });
  // collider_data.setStages( 'maze', maze_walls );
  // collider_data.init('maze', '.');

  // collider_triggers.addTriggers({
  //   success : function(e, person, collider ){
  //     alert('yes u out');
  //     timer.pause();
  //   },
  //   entrance: function(e, person, collider ){
  //     alert('you want to go back?');
  //     timer.pause();
  //   }
  // });

  // animates.push(person);
  // timer.start();
});