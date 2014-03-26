// Copyright 2002-2007.  Adobe Systems, Incorporated.  All rights reserved.
// Create a new art layer and convert it to a text layer.
// Set its contents, size and color.

// enable double clicking from the Macintosh Finder or the Windows Explorer
#target photoshop

// in case we double clicked the file

// debug level: 0-2 (0:disable, 1:break on error, 2:break at beginning)
$.level = 1;
// debugger; 
// launch debugger on next line
var docRef = app.activeDocument;
// wait a sec
var eventWait = charIDToTypeID("Wait")
var enumRedrawComplete = charIDToTypeID("RdCm")
var typeState = charIDToTypeID("Stte")
var keyState = charIDToTypeID("Stte")
var desc = new ActionDescriptor()
desc.putEnumerated(keyState, typeState, enumRedrawComplete)
executeAction(eventWait, desc);

// helpers
// 

function each( arr, liter){
  for(var i =0, n = arr.length;i<n;i++){
    if (liter(arr[i],i,arr) === false){
      return;
    }
  }
}

function map( arr, liter) {
  var ret = [];
  for(var i =0, n = arr.length;i<n;i++){
    ret.push(liter(arr[i],i,arr));
  }
  return ret;
}

function writeFile ( path, content ) {
  var file = new File( path );
  file.encoding = 'UTF8';
  file.open('w');
  file.write( content );
  file.close();
}

// for debugger usage
function readPath ( pathItem ) {
  var str = [];
  var subPaths = pathItem.subPathItems;
  var subPath, points;
  each( subPaths, function( subPath, i ) {
    str.push(i);
    str.push( bb2Hbb2strTML(boundingBox(subPath.pathPoints), className) );
  });
  return str;
}
function exportsHTML ( pathItem, className ) {
  var str = [];
  var subPaths = pathItem.subPathItems;
  var subPath, points;
  each( subPaths, function( subPath ) {
    str.push( bb2HTML(boundingBox(subPath.pathPoints), className) );
  });

  return str;
}
function boundingBox ( points4 ) {
  var x = map(points4,function( point ) {
    return point.anchor[0];
  });
  var y  = map(points4,function( point ) {
    return point.anchor[1];
  });
  var x1 = Math.round(Math.min.apply(null,x));
  var x2 = Math.round(Math.max.apply(null,x));

  var y1 = Math.round(Math.min.apply(null,y));
  var y2 = Math.round(Math.max.apply(null,y));
  
  var width  = x2 - x1; 
  var height = y2 - y1; 
  return {
    tl     : [x1,y1],
    rb     : [x2,y2],
    width  : width,
    height : height
  };
}

function bb2str ( bb ) {
  return [
  '  top   : ' + bb.tl[1] + 'px,',
  '  left  : ' + bb.tl[0] + 'px,',
  '  width : ' + bb.width + 'px,',
  '  height: ' + bb.height+ 'px'
  ].join('\n');
}

function bb2HTML ( bb, className ) {
  return [
  '<div class="' + className + '" style="',
  '  top   : ' + bb.tl[1] + 'px;',
  '  left  : ' + bb.tl[0] + 'px;',
  '  width : ' + bb.width + 'px;',
  '  height: ' + bb.height+ 'px;',
  '"></div>'
  ].join('');
}



// for debugger
// writeFile( 'D:\\backup\\photoshopScripts\\log.txt', 
//             readPath(docRef.pathItems[0] ).join('\n')  )

             
var content =  [];
each(docRef.pathItems,function( item ) {
  content = content.concat( exportsHTML(item, item.name));
});

writeFile( 'walls.html', 
            content.join('\n')  );
