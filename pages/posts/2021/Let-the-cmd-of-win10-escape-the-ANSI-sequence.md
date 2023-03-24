---
title: 让win10的cmd转义ANSI序列（让cmd显示彩色字体）
date: 2021-08-15 22:10:10
tags:

- CMD
- ANSI
- 色彩

---

# 前言

之前在使用IDEA编写Node.js时候调试的时候遇到了cmd上下显示一些奇怪的字符的问题（第一感应该是转义成彩色字符的东西）。网络上搜索了一下

```
维基百科 https://zh.wikipedia.org/wiki/ANSI转义序列 ANSI转义序列
ANSI转义序列（ANSI escape
sequences）是一种带内信号的转义序列标准，用于控制视频文本终端上的光标位置、颜色和其他选项。在文本中嵌入确定的字节序列，大部分以ESC转义字符和"["
字符开始，终端会把这些字节序列解释为相应的指令，而不是普通的字符编码。
```

简单说，想在cmd中显示彩色字体，就要让cmd实现ANSI序列转义

# 开始动手

## 使用网络上广传的ansicon.exe方案

### 简介

```
@adoxa https://github.com/adoxa/ansicon readme.md
ANSICON provides ANSI escape sequences for Windows console programs. It provides much the same functionality as ANSI.SYS
does for MS-DOS.
ANSICON 为 Windows 控制台程序提供 ANSI 转义序列。 它提供了与 ANSI.SYS 为 MS-DOS 所做的相同的功能。
```

### 下载

从 [github](https://github.com/adoxa/ansicon/releases) 上下载最新的 release 文件
使用 [fastgit](https://hub.fastgit.org/adoxa/ansicon/releases) 反向代理的github上下载

### 安装

解压上面下载的压缩包，把`ansicon.exe`和`ANSI64.dll`复制到`C:/Windows/System32/`
（当然在win10大版本升级的时候，老系统会移动到Windows.old，也就相当于文件丢失，我这边建议在`C:\Program Files\`
下建立一个`ansicon`文件夹名，再把这个文件夹加入path环境变量中）

按`Win + R`输入`regedit`打开注册表格定位到`计算机\HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Command Processor`
下，新建字符串值`AutoRun`，双击该值，在数值数据中填写`ansicon`
这下就是在cmd每次启动时候自动运行`ansicon.exe`

## 使用比较小众的 VirtualTerminalLevel 方法

### 简介

因为觉得上面让cmd启动时总是run一个程序，显得不是特别优美。所以我继续查了一下，有一个 [VirtualTerminalLevel 控制台虚拟终端序列](https://docs.microsoft.com/zh-cn/windows/console/console-virtual-terminal-sequences)
的东西。

### 使用

按`Win + R`输入`regedit`打开注册表格定位到`计算机\HKEY_CURRENT_USER\Console`下，新建DWORD(32 位)值`VirtualTerminalLevel`
，双击该值，在数值数据中填写`1`
然后再重新打开cmd就能看到效果了

# 效果展示

~~貌似composer用cmd打开默认是显示彩色的~~
![yun-bg](https://public.inprtx.eu.org/blog/2021/2021-08-15-23-15-15.png)

# 参考资料/内容引用

* [维基百科 - ANSI转义序列](https://zh.wikipedia.org/wiki/ANSI转义序列)
* [鴻塵 - Windows命令行中正确显示颜色](https://hwame.top/20210618/ansi-color-in-windows-cmd.html)
* [微软 - 控制台虚拟终端序列](https://docs.microsoft.com/zh-cn/windows/console/console-virtual-terminal-sequences)
