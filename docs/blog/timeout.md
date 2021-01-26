---
title: 经典面试题 - for循环定时器输出i 
date: 2021-01-25
tags:
 - JavaScript
 - 前端
categories:
 - 技术分享
 - JavaScript
publish: true
---
[[toc]]

## 原题

首先来看题目，说出以下代码的输出结果以及间隔时间以及如何改进

```js
for (var i = 0; i < 10; i++) {
  setTimeout(() => {
    console.log(i)
  }, 1000)
}
```

这个其实涉及到`event loop`，先执行for循环，再执行`setTimeout`，`setTimeout`执行的时候变量i已经是10了，所以输出结果应该是一秒后同时输出10个10；

## 改进

那么问题来了如何让