fonts-streamline
================

根据字体库指定的文字，组成新字库

提取想要的字体，提高字体文件利用率

## 使用方法

> fonts-streamline 文本 ./svg字体文件.svg ./输出字体文件.svg

```
eg:
fonts-streamline "一块钢板的艺术之旅40道工艺制程，193道精细工序1010步锻压成型不锈钢金属边框，40个工艺制程。 依然是全球最快的手机。小米手机 31234567890" ./FZLTCXHJW.svg ./iconfont.svg
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

###使用脚本 convert2svgfont.pe

### eg: ./convert2svgfont.pe FZLTCXHJW.TTF


### 参考项目

* [svgfont2svgicons](https://github.com/nfroidure/svgfont2svgicons)
* [svgicons2svgfont](https://github.com/nfroidure/svgicons2svgfont)