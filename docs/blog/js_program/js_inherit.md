---
title: JavaScript高级程序设计 - 继承
date: 2021-07-07
tags:
  - JavaScript
categories:
  - JavaScript
publish: true
---

[[toc]]

# 继承

继承是面向对象编程中讨论最多的话题。很多面向对象语言都支持两种继承：接口继承和实现继承。前者只继承方法签名，后者继承实际的方法。接口继承在 `ECMAScript` 中是不可能的，因为函数没有签名(`TypeScript`中是有接口`interface`的)。实现继承是 `ECMAScript` 唯一支持的继承方式，而这主要是通过原型链实现的。

## 原型链
