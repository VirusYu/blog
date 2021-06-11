---
title: JavaScript高级程序设计 - 执行上下文与作用域
date: 2021-06-11
tags:
  - JavaScript
categories:
  - JavaScript
publish: true
---

[[toc]]

## 执行上下文与作用域

执行上下文（以下简称“上下文”）的概念在 JavaScript 中是颇为重要的。变量或函数的上下文决定
了它们可以访问哪些数据，以及它们的行为。每个上下文都有一个关联的变量对象（variable object），
而这个上下文中定义的所有变量和函数都存在于这个对象上。虽然无法通过代码访问变量对象，但后台
处理数据会用到它。