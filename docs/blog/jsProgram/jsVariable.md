---
title: JavaScript高级程序设计 - js变量
date: 2021-03-27
tags:
  - JavaScript
categories:
  - JavaScript
publish: true
---

[[toc]]

## 变量

`ECMAScript`变量是松散类型，意思是变量可以声明任何类型的数据。每个变量不过是用于保存任意值的命名占位符，可以通过`var
`、`let`、`const`来声明变量，其中`var`可以再任何版本中使用，而`let`和`const`只能在ES6以上版本中才可以使用。

### var关键字
```js
var message
```
这行代码命名了一个名为`message`的变量，可以用它保存任何类型的值，不初始化的情况下会保存一个特殊值`undefined`。

```js
var message = 'hello world'
```
`ECMAScript`实现变量初始化，因此可以在定义变量的同时去设置它的值。

```js
var message = 'hello world'
message = 100
```
一开始`message`被定义并保存为一个字符串值为`'hello world'`的变量，然后被重写为值为100的数字，虽然这种写法不推荐，但是在js中这是完全生效的。
### let声明

### const声明