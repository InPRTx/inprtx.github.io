---
title: 使用vscode编写hexo博客-图片问题处理
date: 2021-08-10 21:42:19
tags:
- vscode
- hexo
---

# 前言
---

在迁移到hexo博客环境后，我原本是打算使用IDEA作为编写工具。但在这过程中我遇到了Hexo markdown图片预览问题,习惯性按格式化键
把markdown 页面变量 弄炸的问题。
所以换个思路来想，就觉得jetbrains应该不会对hexo支持(魔改IDEA)有那么优美，所以这就打算换到vscode来编写试试。

# 开始动手

## 资源文件夹

根据官方的原话
```
@hexo https://hexo.io/zh-cn/docs/tag-plugins.html 标签插件（Tag Plugins）
资源（Asset）代表 source 文件夹中除了文章以外的所有文件，例如图片、CSS、JS 文件等。比方说，如果你的Hexo项目中只有少量图片，那最简单的方法就是将它们放在
source/images 文件夹中。然后通过类似于 \!\[\](/images/image.jpg) 的方法访问它们。
对于那些想要更有规律地提供图片和其他资源以及想要将他们的资源分布在各个文章上的人来说，Hexo也提供了更组织化的方式来管理资源。这个稍微有些复杂但是管理资源非常方便的功能可以通过将
config.yml 文件中的 post_asset_folder 选项设为 true 来打开。
```
在_posts下，同名博文和文件夹会使得方式更简介一些
所以要做到的只要把

```yml
post_asset_folder: true
```

目录结构：

```
|-- source
    |-- _posts
        |-- hello-world.md
        |-- hello-world
            |-- Snipaste_2021-08-10_22-47-45.png
```

## vscode准备的插件

1. 名称: Paste Image [安装链接](vscode:extension/mushan.vscode-paste-image)
   简单来说就是方便在vscode里粘贴图片用的(快捷键Ctrl+Alt+V)

```
ID: mushan.vscode-paste-image
说明: paste image from clipboard directly
版本: 1.0.4
发布者: mushan
VS Marketplace 链接: https://marketplace.visualstudio.com/items?itemName=mushan.vscode-paste-image
```

2. 名称: Markdown Preview Enhanced [安装链接](vscode:extension/shd101wyy.markdown-preview-enhanced)
   根据前者经验，我先改成这个预览吧

```
ID: shd101wyy.markdown-preview-enhanced
说明: Markdown Preview Enhanced ported to vscode
版本: 0.5.22
发布者: Yiyi Wang
VS Marketplace 链接: https://marketplace.visualstudio.com/items?itemName=shd101wyy.markdown-preview-enhanced
```

## 对插件配置的魔改

### Paste Image篇

打开 显示命令面板(Ctrl+Shift+P)，搜索WorkSpace setting.json

``` json
{
    "pasteImage.path": "${currentFileNameWithoutExt}/",
    "pasteImage.insertPattern": "{% asset_img ${imageFileName} %}"
}
```

### Markdown Preview Enhanced篇

貌似前者的代码给出的代码都有点小问题
这里贴出我修改后的
打开 显示命令面板(Ctrl+Shift+P)，搜索 `Markdown Preview Enhanced: Extend Parser`
添加js引用

```js parser.js
var path = require("path");
var vscode = require("vscode");
```

修改onWillParseMarkdown方法

```js parser.js
onWillParseMarkdown: function (markdown) {
  return new Promise((resolve, reject) => {
    markdown = markdown.replace(
      /\{%\s*asset_img\s*(\S+) \s*\S*\s*%\}/g,
      (whole, content) => {
        abs_filename = vscode.window.activeTextEditor.document.fileName;
        filename = path.basename(abs_filename);
        filename = filename.substring(0, filename.indexOf('.'))
        return `![](${filename + "/" + content})`;
      }
    )
    return resolve(markdown)
  })
}
,
```

# 效果预览

![yun-bg](https://public.inprtx.eu.org/blog/2021/2021-08-10-23-13-52.png)
这里放一下隔壁博客 [链接](https://xiguaweb.net) /逃

# 总结

总的来说，使用vscode的预览还不如用 hexo-browsersync（热刷新，显示的效果=最终结果）。但生命在于折腾嘛/笑

# 参考资料/内容引用

* [Hexo - 标签插件（Tag Plugins）](https://hexo.io/zh-cn/docs/tag-plugins.html)
* [Mr Han - VsCode编写Hexo支持的MD文档 ](https://linbei.top/vscode编写md/)
* [maple-leaf-0219 - vscode hexo markdown定制思路](https://maple-leaf-0219.github.io/2020/vscode-hexo-markdown%E5%AE%9A%E5%88%B6%E6%80%9D%E8%B7%AF/)
