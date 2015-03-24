define([

],function(

){

  return function( grid_x, grid_y ){


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
                [ x, y-1 ],
                [ x-1, y ],
                [ x+1, y ],
                [ x, y+1 ]
              ].filter(function( item ){
                return get_ceil(item);
              });
    }
    function get_ceil( item ){
      var x = item[0];
      var y = item[1];
      return y >= 0 && y < grid_y && x>=0 && x <grid_x;
    }
    function add_checking( item ){
      var x = item[0];
      var y = item[1];
      var nearbys = get_nearby_ceil(item);
      nearbys.forEach(function(item){ 
        if( !is_choosed(item) ){
          checkings.push([
            [ x, y ], 
            [ item[0]-x, item[1]-y ]
          ]);
        }
      });
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
                  Math.floor(Math.random()*grid_x),
                  grid_y - 1
                ];
    start[0] = start[0] % 2 ? Math.max(1,start[0]-1) : start[0];
    choose(start);
    add_checking(start);

    while(checkings.length){
      grow_with(random_pop(checkings));
    }

    var total_len = grid_x*grid_y;
    var total = [];
    total.length = total_len;
    var walls = [];
    var road = [];
    Object.keys(choosed)
      .forEach(function( choosed ){
        choosed = choosed.split(',');
        var idx = 1*choosed[0] + choosed[1] * grid_x;

        if( 1*choosed[0] != idx % grid_x ){
          console.log( 1*choosed[0], 1*choosed[1] );
          console.log( idx % grid_x, Math.floor( idx / grid_x ) );
        }

        total[idx] = true;
        road.push(idx);
      });

    for(var i = 0; i < total_len;i++){
      if( !total ){
        walls.push(i);
      }
    }

    return {
      road   : road,
      walls  : walls,
      total  : total,
      width  : grid_x,
      height : grid_y
    };

  };

});