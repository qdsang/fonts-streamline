#! /usr/bin/env node

var svgfont2svgicons = require(__dirname + '/../src/svgfont2svgicons.js')
  , Fs = require('fs')
  , path = require('path')
;

var svgicons2svgfont = require(__dirname + '/../src/svgicons2svgfont.js');

var fontString = process.argv[2];
var fontFileInput = process.argv[3];
var fontFileOutput = process.argv[4];
var fontFileOutputName = process.argv[5];

var fontStream = Fs.createReadStream(fontFileInput);
var iconProvider = svgfont2svgicons();
var unamedIconCount = 0;

fontStream.pipe(iconProvider);

var glyphs = [], index = 1, timer;
iconProvider.on('readable', function() {
  var glyph, steam;
  while(null !== glyph) {
    glyph = iconProvider.read();
    if(glyph && glyph.codepoint != '' && fontString.indexOf(glyph.codepoint) != -1) {
      console.log(index + ' Saving glyph "' + glyph.name + '" to "' + glyphPath + '" codepoint: ' + glyph.codepoint);
      index++;
      glyph.codepoint_origin = glyph.codepoint;
      glyph.codepoint = ('' + glyph.codepoint).charCodeAt(0);
      glyphs.push(glyph);
    }
  }
  clearTimeout(timer);
  timer = setTimeout(function(){
    if (glyphs.length) {
      makesvgfont(glyphs);
    }
  }, 800);
});

function makesvgfont(glyphs){
  //console.log(glyphs);
  svgicons2svgfont(glyphs, {
      fontName: fontFileOutputName || ''
    }
  ).pipe(Fs.createWriteStream(fontFileOutput));
}
