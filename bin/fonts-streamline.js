#! /usr/bin/env node

var svgfont2svgicons = require(__dirname + '/../src/svgfont2svgicons.js')
  , fs = require('fs')
  , path = require('path')
;
var StringDecoder = require('string_decoder').StringDecoder;
var svgicons2svgfont = require(__dirname + '/../src/svgicons2svgfont.js');

var svg2ttf = require('svg2ttf');
var ttf2woff = require('ttf2woff');
var ttf2eot = require('ttf2eot');

var fontString = process.argv[2];
var fontFileInput = process.argv[3];
var fontFileOutput = process.argv[4];
var fontFileOutputFileName = path.basename(fontFileOutput, path.extname(fontFileOutput));
var fontFileOutput_fix = path.join(path.dirname(fontFileOutput), fontFileOutputFileName);
var fontFileOutputName = process.argv[5] || 'iconfont';

var fontStream = fs.createReadStream(fontFileInput);
var iconProvider = svgfont2svgicons();
var unamedIconCount = 0;

fontStream.pipe(iconProvider);

var glyphs = [], index = 1;
iconProvider.on('readable', function() {
  var glyph, steam;
  while(null !== glyph) {
    glyph = iconProvider.read();
    if(glyph && glyph.codepoint != '' && fontString.indexOf(glyph.codepoint) != -1) {
      console.log(index + ' Saving glyph "' + glyph.name + '" codepoint: ' + glyph.codepoint);
      index++;
      glyph.codepoint_origin = glyph.codepoint;
      glyph.codepoint = ('' + glyph.codepoint).charCodeAt(0);
      glyphs.push(glyph);
    }
  }
});

iconProvider.on('end', function() {
  console.log('svgfont2svgicons end');
  makesvgfont(glyphs);
});

function makesvgfont(glyphs){
  //console.log(glyphs);
  generators.svg(glyphs, function(svgFont){

    console.log('generators svg end');
    generators.ttf(svgFont, function(ttfFont){

      console.log('generators ttf end');
      generators.woff(ttfFont, function(){

        console.log('generators woff end');
        generators.eot(ttfFont, function(){
          console.log('generators eot end');
        });

      });

    });

  });
}

var fonts = {};

var generators = {
  svg: function(glyphs, done) {
    // https://github.com/sapegin/grunt-webfont/blob/master/tasks/engines/node.js
    var font = '';
    var decoder = new StringDecoder('utf8');
    var stream = svgicons2svgfont(glyphs, {
        fontName: fontFileOutputName || ''
        /*
        fontName: o.fontName,
        fontHeight: o.fontHeight,
        descent: o.descent,
        normalize: o.normalize,
        log: logger.verbose.bind(logger),
        error: logger.error.bind(logger)
        */
      }
    );

    stream.on('data', function(chunk) {
      font += decoder.write(chunk);
    });

    stream.on('end', function() {
      fonts.svg = font;
      fs.writeFileSync(fontFileOutput_fix + '.svg', font);
      done(font);
    });
  },
  ttf: function(svgFont, done) {
    var ttf = svg2ttf(svgFont, {});
    var font = new Buffer(ttf.buffer);
    fonts.ttf = font;
    fs.writeFileSync(fontFileOutput_fix + '.ttf', font);
    done(font);
  },

  woff: function(ttfFont, done) {
    var font = ttf2woff(new Uint8Array(ttfFont), {});
    font = new Buffer(font.buffer);
    fonts.woff = font;
    fs.writeFileSync(fontFileOutput_fix + '.woff', font);
    done(font);
  },

  eot: function(ttfFont, done) {
    var font = ttf2eot(new Uint8Array(ttfFont));
    font = new Buffer(font.buffer);
    fonts.eot = font;
    fs.writeFileSync(fontFileOutput_fix + '.eot', font);
    done(font);
  }
}

