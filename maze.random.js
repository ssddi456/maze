require([
  './random_map',
  './generate_map',
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
  random_map,
  generate_map,
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

  var width = 665;
  var height = 195;
  var block = 15;
  generate_map( 
    random_map( Math.floor(width/block), Math.floor(height/block)),
    {
      width  : width,
      height : height,
      block  : block
    });

  timer.mainLoop(function( delta_t ) {
    animates.forEach(function( wanderer ){
      if( !wanderer.dead ){
        mover( wanderer, delta_t );
      }
    });
    collider.mario_collide( animates );
  });

  collider_data.setStages( 'maze', maze_walls );
  collider_data.init('maze', '.');

  collider_triggers.addTriggers({
    success : function(e, person, collider ){
      alert('yes u out');
      timer.pause();
    },
    entrance: function(e, person, collider ){
      alert('you want to go back?');
      timer.pause();
    }
  });

  animates.push(person);
  timer.start();
});