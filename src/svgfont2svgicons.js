/*
 * svgfont2svgicons
 * https://github.com/nfroidure/svgfont2svgicons
 *
 * Copyright (c) 2013 Nicolas Froidure
 * Licensed under the MIT license.
 */
"use strict";

// Required modules
var Path = require("path")
  , util = require("util")
  , Stream = require("readable-stream")
  , Sax = require("sax")
  , SVGPathData = require("svg-pathdata")
  , Plexer = require('plexer')
  , StreamQueue = require('streamqueue')
;

// Inherit of stream duplexer
util.inherits(SVGFont2SVGIcons, Plexer);

// Constructor
function SVGFont2SVGIcons(options) {
  var inputStream = null
    , outputStream = null
    , saxStream = null
    , pathParser = null
    , startContent = null
    , endContent = null
    , ascent = 0
    , descent = 0
    , horizontalAdv = 0
    , glyph = null
    , glyphCount = 0
    , d = ''
  ;

  // Ensure new were used
  if(!(this instanceof SVGFont2SVGIcons)) {
    return new SVGFont2SVGIcons(options);
  }

  // Initialize streams
  inputStream = new Stream.PassThrough()
  outputStream = new Stream.PassThrough({objectMode: true})
  saxStream = Sax.createStream(true)

  // Parent constructor
  Plexer.call(this, {
    objectMode: true
  }, inputStream, outputStream);
  
  // Setting objectMode separately
  this._writableState.objectMode = false;
  this._readableState.objectMode = true;

  // Listening to new tags
  saxStream.on('opentag', function(tag) {
    // Save the default sizes
    if('font' === tag.name) {
      if('horiz-adv-x' in tag.attributes) {
        horizontalAdv = parseFloat(tag.attributes['horiz-adv-x'], 10);
      }
    }
    if('font-face' === tag.name) {
      if('ascent' in tag.attributes) {
        ascent = parseFloat(tag.attributes.ascent, 10);
      }
      if('descent' in tag.attributes) {
        descent = parseFloat(tag.attributes.descent, 10);
      }
    }
    // Detect glyphs
    if('glyph' === tag.name) {
      // Fill the glyph object
      glyph = {
        name: '',
        codepoint: '',
        width: horizontalAdv,
        height: Math.abs(descent) + ascent,
        stream: new StreamQueue()
      };
      if('glyph-name' in tag.attributes) {
        glyph.name = tag.attributes['glyph-name'];
      } else {
        glyph.name = 'icon' + (++glyphCount);
      }
      if('horiz-adv-x' in tag.attributes) {
        glyph.width = tag.attributes['horiz-adv-x'];
      }
      if('unicode' in tag.attributes) {
        glyph.codepoint = tag.attributes.unicode;
      }
      d = '';
      if('d' in tag.attributes) {
        d = tag.attributes.d;
      }
      outputStream.write(glyph);
      startContent = new Stream.PassThrough()
      glyph.stream.queue(startContent);
      startContent.write('<?xml version="1.0" encoding="UTF-8" standalone="no"?>\
<svg\
   xmlns:svg="http://www.w3.org/2000/svg"\
   xmlns="http://www.w3.org/2000/svg"\
   version="1.1"\
   width="' + glyph.width + '"\
   height="' + glyph.height + '"\
   viewBox="0 0 ' + glyph.width + ' ' + glyph.height + '">\
  <path\
     d="');
      startContent.end();
      // Transform the glyph content
      if(d) {
        pathParser = new SVGPathData.Parser();
        glyph.stream.queue(
          pathParser.pipe(new SVGPathData.Transformer(
            SVGPathData.Transformer.Y_AXIS_SIMETRY, glyph.height
          )).pipe(new SVGPathData.Transformer(
            SVGPathData.Transformer.TRANSLATE, 0, descent
          )).pipe(new SVGPathData.Encoder())
        );
        pathParser.write(d);
        pathParser.end();
      }
      endContent = new Stream.PassThrough()
      glyph.stream.queue(endContent);
      endContent.write('"\
     id="' + glyph.name + '" />\
</svg>');
      endContent.end();
      glyph.stream.done();
    }
  });

  inputStream.pipe(saxStream);
  saxStream.once('end', function() {
    outputStream.end();
  });
}

module.exports = SVGFont2SVGIcons;

