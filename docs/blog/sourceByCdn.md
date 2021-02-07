---
title: vue中使用cdn加载资源
date: 2021-02-07
tags:
 - JavaScript
 - webpack
categories:
 - JavaScript
publish: true
---
[[toc]]

# 前言

在`Vue`项目中，引入到工程中的所有`js`、`css`文件，编译时都会被打包进`vendor.js`。如果引入的库比较多，那么`vendor.js`文件体积将会相当的大，会影响资源的加载，进而影响页面的渲染，那么减少`vendor`体积大小，就可以一定程度上提升页面加载效率。

将引用的外部`js`、`css`等文件与项目剥离，使其不编译到`vendor.js`中，而是通过`script`引入资源。浏览器会使用多个线程
异步将`vendor.js`和外部的`js`加载，达到提升加载速度的目的。

# Vue Cli 2.x
## 资源引入

在`index.html`中，添加`CDN`资源，例如`bootcss`上的资源：

``` html
<body>
<div id="app"></div>
<script src="https://cdn.bootcss.com/vue/2.5.2/vue.min.js"></script>
<script src="https://cdn.bootcss.com/vue-router/3.0.1/vue-router.min.js"></script>
<script src="https://cdn.bootcss.com/vuex/3.0.1/vuex.min.js"></script>
</body>
```

## 添加配置

```js
module.exports = {
  entry: {
    app: './src/main.js'
  },
  externals:{
    'vue': 'Vue',
    'vue-router': 'VueRouter',
    'vuex':'Vuex'
  }
}
```

格式为 'aaa' : 'bbb', 其中，aaa表示要引入的资源的名字，bbb表示该模块提供给外部引用的名字，由对应的库自定。例如，vue为Vue，vue-router为VueRouter.

## 去除原有的引用

去掉代码中的引用

```js
// import Vue from 'vue'
// import Router from 'vue-router'
```

去掉Vue.use(XXX)，如：

```js
Vue.use(Router)
```

# Vue Cli 3.0+

