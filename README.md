fonts-streamline
================

根据字体库指定的文字，组成新字库

提取想要的字体，提高字体文件利用率

现在只支持SVG格式字体生成svg、ttf、woff、eot格式字体，所以在使用前必要先转换成svg格式字体，转换方法拖到下面去找。


# 使用方法

> fonts-streamline 文本 svg字体文件路径 输出字体文件路径

```
eg:
fonts-streamline "一块钢板的艺术之旅40道工艺制程" ./FZLTCXHJW.svg ./iconfont.svg
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


## 开始转换


参考脚本 convert2svgfont.pe， 这是在mac系统下的例子，如果你写好了其他的例子，麻烦帮忙push下。
 
eg: ./convert2svgfont.pe ./FZLTCXHJW.TTF


# 参考项目

* [svgfont2svgicons](https://github.com/nfroidure/svgfont2svgicons)
* [svgicons2svgfont](https://github.com/nfroidure/svgicons2svgfont)