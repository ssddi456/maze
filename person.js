define([
  'gamelibs/keybroad',
  'gamelibs/engine',
  'gamelibs/collider_util',
  'jquery'
],function(
  keybroad,
  engine,
  collider_util,
  $
){
  var person    = new engine();
  person.el     = $('.person');
  person.is_mario = true;
  person.pos    = collider_util.getpos( person.el );
  person.prepos = $.extend({},person.pos);
  person.move   = function() {
    this.el.css(this.pos);
  };
  person.loseEnergy  =
  person.onCollusion = function(){};
  person.updateSpeed = function() { 
    var deltax = 0.4 * this.maxspeed;
    var deltay = deltax;

    if( keybroad.haspressed('d') ){
      this.t_speed.x += deltax;
    }
    if( keybroad.haspressed('a') ){
      this.t_speed.x += -1 * deltax;
    }
    if( keybroad.haspressed('s') ){
      this.t_speed.y += -1 * deltay;
    }
    if( keybroad.haspressed('w') ){
      this.t_speed.y += deltay;
    }

    this.t_speed.x = engine.dcc( this.t_speed.x, this.maxspeed );
    this.t_speed.y = engine.dcc( this.t_speed.y, this.maxspeed );

    this.normalizeSpeed();
  };
  person.status = 'walk';
  return person;
});