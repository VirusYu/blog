---
title: 经典面试题 - for循环定时器输出i 
date: 2021-01-25
tags:
 - JavaScript
categories:
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

那么问题来了如何让上述代码按照预期执行呢，也就是让程序每过一秒输出对应的 1、2、3

### 方法一

使用`let`，`let`存在块级作用域，不存在变量提升

```js
for (let i = 0; i < 10; i++) {
  setTimeout(() => {
    console.log(i)
  }, i * 1000)
}
```

### 方法二

使用函数来传递参数，因为`number`，`string`是值传递，所以对函数内部不会有影响

```js
function log(value) {
  setTimeout(() => {
    console.log(value)
  }, value * 1000)
}
for (var i = 0; i < 10; i++) {
  log(i);
}
```

### 方法三

其实是方法二的变种，没有本质的区别

```js
for (var i = 0; i < 10; i++) {
  (function(v){
    setTimeout(() => {
      console.log(v)
    }, v * 1000)
  })(i)
}
```

### 方法四

使用`setTimeout`的[额外参数](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/setTimeout)，可以作为参数传递给function

```js
for (var i = 0; i < 10; i++) {
    setTimeout((v) => {
      console.log(v)
    }, i * 1000, i)
}
```