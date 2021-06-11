---
title: JavaScript高级程序设计 - js语言基础
date: 2021-03-27
tags:
  - JavaScript
categories:
  - JavaScript
publish: true
---

[[toc]]

## JavaScript 语法

- 区分大小写，在`JavaScript`中，一切都区分大小写，不论是变量、函数名、还是操作符。比如`test`和`Test`就是两个不同的变量
- 标识符，第一个字符必须是一个字母、下划线(_)、或者美元符号(\$)，其他字符可以是字母、下划线、美元或数字，一般按照命名规范来说，以下划线(_)开头的是私有属性，不会暴露给外界，一般使用驼峰大小写来命名，如：`helloWorld`、`MyBlog`等，常量一般使用全大写来表明，如：`PAGESIZE`等

## 注释

采用 C 语言注释的风格，包括当行注释和块注释，如：

```js
// 单行注释
/* */ 块注释
```

## 严格模式

ES5 增加了严格模式的概念，使用`use strict`开启严格模式，严格模式会对于一些不安全的写法，将会抛出错误，如：

```js
'use strict'
// 不用 var 声明变量
a = ''
// 给不可写属性赋值
var obj1 = {}
Object.defineProperty(obj1, 'x', { value: 42, writable: false })
obj1.x = 9 // 抛出TypeError错误
// 给只读属性赋值
var obj2 = {
  get x() {
    return 17
  }
}
obj2.x = 5 // 抛出TypeError错误
// 给不可扩展对象的新属性赋值
var fixed = {}
Object.preventExtensions(fixed)
fixed.newProp = 'ohai' // 抛出TypeError错误
var o = { p: 1, p: 2 } // !!! 语法错误 PS:这个问题在ECMAScript6中已经不复存在
```

## 关键字与保留字

`ECMA-262`中描述了一组保留的关键字，意味着这些关键词有特殊用户，不能用于变量声明或者属性名。

```js
/* 
break、else、new、var、case、finally、return、void、catch、for、switch、while、continue、function、this、with、default、if、throw、delete、in、try、do、instranceof、typeof。

abstract、enum、int、short、boolean、export、interface、static、byte、extends、long、super、char、final、native、synchronized、class、float、package、throws、const、goto、private 、transient、debugger、implements、protected 、volatile、double、import、public。

*/
```