define([

],function(

){
  function matrix( w, h ){
    this.matrix = [];
    this.width = w;
    this.height = h;
    this.total = w * h;
  }

  var mp = matrix.prototype;
  mp.get = function( x, y ){
    var n = x;
    if( arguments.length == 2 ){
      n = x + y*this.width;
    }
    return this.matrix[n];
  };
  mp.set = function(x,y,val){
    var n = x;
    if( arguments.length == 3 ){
      n = x + y*this.width;
    } else {
      val = y;
    }
    this.matrix[n] = val;
  };
  mp.direct_up = function( x, y ){
    var n = x;
    if( arguments.length == 2 ){
      n = x + y*this.width;
    } else if(arguments.length == 1 ){
      x = n%this.width;
      y = Math.floor(x/this.width);
    }
    
    if( y <= 0 ){
      return false;
    }
    return n - this.width;
  }
  mp.direct_down = function( x, y ){
    var n = x;
    if( arguments.length == 2 ){
      n = x + y*this.width;
    } else if(arguments.length == 1 ){
      x = n%this.width;
      y = Math.floor(x/this.width);
    }
    if( y >= this.height ){
      return false;
    }
      
    return n + this.width;
  }
  mp.direct_left = function( x, y ){
    var n = x;
    if( arguments.length == 2 ){
      n = x + y*this.width;
    } else if(arguments.length == 1 ){
      x = n%this.width;
      y = Math.floor(x/this.width);
    }
    if( x <=0 ){
      return false;
    }
    return n-1;
  }
  mp.direct_right = function( x, y ){
    var n = x;
    if( arguments.length == 2 ){
      n = x + y*this.width;
    } else if(arguments.length == 1 ){
      x = n%this.width;
      y = Math.floor(x/this.width);
    }
    if( x >= this.width ){
      return false;
    }
    return n+1;
  }
  mp.walk_rows = function( handle ){
    for(var i =0; i < this.total; i ++ ){
      handle( this.matrix[i], i, i%this.width, Math.floor(i/this.width));
    }
  }
  mp.walk_cols = function( handle ){
    var idx, i, j;
    for(i =0; i < this.width; i ++ ){
      for(j =0; j < this.height; j++ ){
        idx = i + j * this.width;
        handle( this.matrix[idx], idx, i, j );
      }
    }
  }
  return matrix;
});