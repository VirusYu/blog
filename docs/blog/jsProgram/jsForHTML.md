---
title: JavaScript高级程序设计 - HTML中的JS
date: 2021-03-25
tags:
 - JavaScript
categories:
 - JavaScript
publish: true
---
[[toc]]

## `script`元素

`script`元素主要有以下8个属性：
 - `async`：可选。表示立刻开始下载脚本，会异步去加载文件，不会阻碍页面渲染和其他文件的下载
 - `charset`：可选。使用`src`属性指定的代码字符集，比较少用
 - `crossorign`：可选。配置跨域相关，默认不使用。一般情况来说`script`资源中的内容是可以允许跨域访问的，但是如果设置`crossorign="use-credentials"`的话，且服务器端没有设置`Access-Control-Allow-Origin` 响应头，就会报错，其实也就是禁止跨域访问资源。
 - `defer`：可选。表示脚本在`document`加载和解析之后再执行，`async`和`defer`类似，但是`async`加载的js并不能保证出现的顺序，异步加载js会保证在页面的`load`事件前执行，但是不能确定在`DOMContentLoaded`之前还是之后。
 - `integrity`：可选。用来对比校验资源和指定的加密签名来验证子资源的完整性。可用于CDN（内容分发网络）不会提供恶意脚本
 - `language`：废弃。用于表示代码块中的js版本
 - `src`：可选。引用资源地址
 - `type`：可选。代替`language`，表示js的MIME类型。这个值通常是`text/javascript`，尽管`text/javascript`和`text/ecmascript`都已经废弃。`JavaScript`的MIME类型通常是`application/x-javascript`，不过给type属性这个值，可能会导致浏览器会忽略这个js文件。在非IE浏览器中，还有其他的有效值`application/javascript`和`application/javascript`,如果这个值是`module`，则代码会被当成ES6模块。

 包含在`script`内的代码，会被从上往下解释。一般情况下，`script`中的代码计算结束之前，页面剩余的其他内容不会加载和显示。

在使用行内`javascript`代码时，代码中不能出现字符串`script`，因为浏览器在解析时，会被当成结束的`script`标签，如要输出`script`，需要增加转义字符`\`

 `script`标签的src属性可以像`img`标签一样，去请求其他域的资源。浏览器在解析这个资源的时候，会像属性指定的路径发送一个`GET`请求，而资源的请求不受浏览器同源策略的限制，当然这个请求还是会受到`HTTP/HTTPS`协议的限制。

 PS：`JSONP`解决跨域问题就是通过这个原理去实现的

## 行内代码与外部文件

既然可以编写行内代码为什么要引用外部文件的js呢，主要原因如下：
 - 可维护性，如果一段js代码在多个页面都用到，写入外部文件只需要写一次，便于开发和维护
 - 缓存，提升性能。浏览器会按照设置去缓存文件，这样在初始化的时候下载一次，在其他页面加载的时候，直接会从缓存中引用，文件只需要下载一次，能大大提升页面的加载速度

## noscript元素

`noscript`元素，当浏览器不支持js或者js被禁用时，来友好的提示用户（之前还会用来做优雅降级，针对不支持js的浏览器）