#! /usr/bin/env node

/*

fonts-streamline "一块钢板的艺术之旅40道工艺制程" ./FZLTCXHJW.svg ./iconfont.svg

*/

var fonts_streamline = require(__dirname + '/../src/index.js')
  , fs = require('fs')
  , path = require('path')
;

var fontString = process.argv[2];
var fontFileInput = process.argv[3];
var fontFileOutput = process.argv[4] || './font.ttf';
var fontFileOutputName = process.argv[5] || '';

var fontFileOutputFileName = path.basename(fontFileOutput, path.extname(fontFileOutput));
var fontOutputFilePath_fix = path.join(path.dirname(fontFileOutput), fontFileOutputFileName);

fonts_streamline({
  keyword: fontString,
  fontFilePath: fontFileInput,
  fontName: fontFileOutputName
}, function(fonts){

  fs.writeFileSync(fontOutputFilePath_fix + '.svg', fonts.svg);
  fs.writeFileSync(fontOutputFilePath_fix + '.woff', fonts.woff);
  fs.writeFileSync(fontOutputFilePath_fix + '.ttf', fonts.ttf);
  fs.writeFileSync(fontOutputFilePath_fix + '.eot', fonts.eot);

  console.log('complete！');
});
