
/*

使用例子

var fonts_streamline = require('fonts-streamline')
  , fs = require('fs');

fonts_streamline({
  keyword: '今天酱油了么？',
  fontFilePath: '/home/Users/dev/test.ttf',
  fontName: 'qdsang'
}, function(fonts){

  fs.writeFileSync('./fonts.svg', fonts.svg);
  fs.writeFileSync('./fonts.woff', fonts.woff);
  fs.writeFileSync('./fonts.ttf', fonts.ttf);
  fs.writeFileSync('./fonts.eot', fonts.eot);

  console.log('ok');
});

*/

var svgfont2svgicons = require('svgfont2svgicons')
  , svgicons2svgfont = require('svgicons2svgfont')
  , fs = require('fs')
  , path = require('path')
  , StringDecoder = require('string_decoder').StringDecoder
  , svg2ttf = require('svg2ttf')
  , ttf2woff = require('ttf2woff')
  , ttf2eot = require('ttf2eot')
;

function font_streamline(options, done) {
  options = options || {};
  done = done || function(){};

  options.keyword = options.keyword || '';
  options.fontFilePath = options.fontFilePath || '';
  options.fontName = options.fontName || 'iconfont';

  var fontStream = fs.createReadStream(options.fontFilePath);
  var iconProvider = svgfont2svgicons();
  var unamedIconCount = 0;

  fontStream.pipe(iconProvider);

  var glyphs = [];
  // 收集被命中的字符
  iconProvider.on('readable', function() {
    var glyph, steam;
    while(null !== glyph) {
      glyph = iconProvider.read();
      if(glyph && glyph.codepoint != '' && options.keyword.indexOf(glyph.codepoint) != -1) {
        console.log(unamedIconCount + ' Saving glyph "' + glyph.name + '" codepoint: ' + glyph.codepoint);
        unamedIconCount++;
        glyph.codepoint_origin = glyph.codepoint;
        glyph.codepoint = ('' + glyph.codepoint).charCodeAt(0);
        glyphs.push(glyph);
      }
    }
  });

  iconProvider.on('end', function() {
    console.log('svgfont2svgicons end');
    makefont(glyphs, options, done);
  });
}

function makefont(glyphs, options, done){
  //console.log(glyphs);
  generators.svg(glyphs, options, function(svgFont){
    console.log('generators svg end');

    generators.ttf(svgFont, function(ttfFont){
      console.log('generators ttf end');

      generators.woff(ttfFont, function(woffFont){
        console.log('generators woff end');

        generators.eot(ttfFont, function(eotFont){
          console.log('generators eot end');
          done(fonts);
        });

      });

    });

  });
}

var fonts = {};

var generators = {
  svg: function(glyphs, options, done) {
    // https://github.com/sapegin/grunt-webfont/blob/master/tasks/engines/node.js
    var font = '';
    var decoder = new StringDecoder('utf8');
    var stream = svgicons2svgfont(glyphs, {
        fontName: options.fontName || ''
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
      done(font);
    });
  },
  ttf: function(svgFont, done) {
    var ttf = svg2ttf(svgFont, {});
    var font = new Buffer(ttf.buffer);
    fonts.ttf = font;
    done(font);
  },

  woff: function(ttfFont, done) {
    var font = ttf2woff(new Uint8Array(ttfFont), {});
    font = new Buffer(font.buffer);
    fonts.woff = font;
    done(font);
  },

  eot: function(ttfFont, done) {
    var font = ttf2eot(new Uint8Array(ttfFont));
    font = new Buffer(font.buffer);
    fonts.eot = font;
    done(font);
  }
}

module.exports = font_streamline;