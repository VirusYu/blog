---
title: JavaScript高级程序设计 - 数据类型
date: 2021-03-28
tags:
  - JavaScript
categories:
  - JavaScript
publish: true
---

[[toc]]

## 数据类型

`ECMAScript`中有 6 种简单数据类型（也称为**原始类型**）：`Undefined`、`Null`、`Boolean`、`String`、`Number`、`Symbol`，还有一种复杂数据类型为`Object`，像 js 中的`Function`、'Array'等都是`Object`。`Object`是一种无序键值对的集合。因为在`ECMAScript`不能定义自己的数据类型，所有值都可以用上述 7 中之一来表示。

## typeof 操作符

因为`ECMAScript`中的类型系统是松散的，所以需要一种手段来确定任意变量的数据类型，`typeof`就是为此而生的。

对一个值使用`typeof`操作符会返回下列字符串之一：

- `undefined`表示值未定义
- `boolean`表示值为布尔值
- `string`表示值为字符串
- `number`表示值为数值
- `object`表示值为对象或`null`
- `function`表示值为函数
- `symbol`表示值为`symbol`(符号)
