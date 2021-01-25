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

```js
//输出结果以及间隔时间，改进
for (var i = 0; i < 10; i++) {
  setTimeout(() => {
    console.log(i)
  }, 1000)
}
```