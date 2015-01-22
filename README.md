更好的项目： https://github.com/aui/font-spider


fonts-streamline
================

根据指定的文字重组字体库。其实就是精简字体库，让页面中轻松挂载任意字体，不必考虑字体文件大小。 

现在只支持SVG格式字体生成svg、ttf、woff、eot格式字体。如果是其他格式字体文件，在使用前必要先转换成svg格式字体，转换方法拖到下面去找。


# 使用方法

> fonts-streamline 文本 svg字体文件路径 输出字体文件路径

```
eg:
fonts-streamline "一块钢板的艺术之旅40道工艺制程" ./FZLTCXHJW.svg ./iconfont.svg
```

或者

```
var fonts_streamline = require('fonts-streamline')
  , fs = require('fs');

fonts_streamline({
  keyword: '今天酱油了么？',
  fontFilePath: '/home/Users/dev/test.svg',
  fontName: 'qdsang'
}, function(fonts){

  fs.writeFileSync('./fonts.svg', fonts.svg);
  fs.writeFileSync('./fonts.woff', fonts.woff);
  fs.writeFileSync('./fonts.ttf', fonts.ttf);
  fs.writeFileSync('./fonts.eot', fonts.eot);

  console.log('ok');
});
```

# 关于字体文件格式转换成SVG格式

## 安装必要组件

### OS X

```
brew install ttfautohint fontforge --with-python
```

*You may need to use `sudo` for `brew`, depending on your setup.*


### Linux

```
sudo apt-get install fontforge ttfautohint
```


### Windows

```
npm install grunt-webfont --save-dev
```

Then [install `ttfautohint`](http://www.freetype.org/ttfautohint/#download) (optional).

*Only `node` engine available (see below).*


### 参考 

https://github.com/sapegin/grunt-webfont


### 开始转换


参考脚本 convert2svgfont.pe， 这是在mac系统下的例子，如果你写好了其他的例子，麻烦帮忙push下。
 
eg: ./convert2svgfont.pe ./FZLTCXHJW.TTF


## 提取网页字符

```
var html = document.body.innerHTML;
var words = html.replace(/[^\u4E00-\u9FA5]/g,'');
words += '1234567890qwertyuiopasdfghjklzxcvbnm,.QWERTYUIOPASDFGHJKLZXCVBNM';
console.log(words);
```

## Stats

[![NPM](https://nodei.co/npm/fonts-streamline.png?downloads=true&stars=true)](https://nodei.co/npm/fonts-streamline/)
[![NPM](https://nodei.co/npm-dl/fonts-streamline.png)](https://nodei.co/npm/fonts-streamline/)


## 参考项目

* [svgfont2svgicons](https://github.com/nfroidure/svgfont2svgicons)
* [svgicons2svgfont](https://github.com/nfroidure/svgicons2svgfont)
