---
title: 面试题 - js任务队列
date: 2021-02-23
tags:
 - JavaScript
categories:
 - JavaScript
publish: true
---
[[toc]]

## 前言

小伙伴在群里分享了一个题目，如下。乍一看感觉很简单，就一个链式调用，当时想直接一个构造函数，然后每个方法里`return this`就好了，结果一看，还有个`sleep`，`sleep`时后面代码不执行，当时我？？？，直接就傻了。后来提醒我可以用任务队列去处理，在研究我岳哥代码、查了n多文档后，才感觉明白了，话不多说上代码。

```js
//实现一个LazyMan，可以按照以下方式调用:
LazyMan('Hank')
// Hi! This is Hank!
LazyMan('Hank').sleep(10).eat('dinner')
// Hi! This is Hank!
//等待10秒..
// Wake up after 10
// Eat dinner~
LazyMan('Hank').eat('dinner').eat('supper')
// Hi This is Hank!
// Eat dinner~
// Eat supper~
LazyMan('Hank').sleepFirst(5).eat('supper')
// 等待5秒
// Wake up after 5
// Hi This is Hank!
// Eat supper
```

## 实现链式调用