var assert = require('assert')
  , svgfont2svgicons = require(__dirname + '/../src/index.js')
  , Fs = require('fs')
  , StringDecoder = require('string_decoder').StringDecoder
  , Path = require("path")
;

// Tests
describe('Parsing fonts', function() {

  it("should work for simple SVG fonts", function(done) {
    var fontStream = Fs.createReadStream(__dirname + '/fixtures/cleanicons.svg');
    var iconProvider = svgfont2svgicons();
    var icons = [];
    var bufferedIcons = 0;
    var ended = false;

    fontStream.pipe(iconProvider);

    iconProvider.on('readable', function() {
      var icon;
      do {
        icon = iconProvider.read();
        if(icon) {
          icon.content = '';
          icons.push(icons);
          icon.stream.on('readable', (function(icon) {
            return function() {
              var chunk;
              do {
                chunk = icon.stream.read();
                if(chunk) {
                  icon.content += chunk.toString('utf-8');
                }
              } while(null !== chunk);
            };
          })(icon));
          icon.stream.once('end', (function(icon) {
            return function() {
              assert.equal(
                Fs.readFileSync(__dirname + '/expected/cleanicons/' + icon.name + '.svg'),
                icon.content
              );
              bufferedIcons++;
              if(ended && icons.length == bufferedIcons) {
                done();
              }
            };
          })(icon));
        }
      } while(null !== icon);
    }).once('end',function() {
      ended = true;
      if(icons.length == bufferedIcons) {
        done();
      }
    });

  });

});
