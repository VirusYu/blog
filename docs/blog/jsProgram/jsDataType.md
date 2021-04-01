---
title: JavaScript高级程序设计 - 数据类型
date: 2021-03-31
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

## Undefined 类型

`Undefined`类型只有一个值，就是`Undefined`，当使用`var`和`let`声明变量但没有初始化时，就相当于给变量赋值了`Undefined`。

## Null 类型

`Null`类型也只有一个值，即特殊值`null`，逻辑上讲`null`值表示一个空对象指针。这也是`typeof null`会返回`object`的原因之一，当然也算是历史遗留问题。

## Boolean 类型

`Boolean`类型是 js 中使用最频繁的类型之一，有两个字面值：`true`和`false`。这两个值不同于数值，因此`true`不等于1，`false`不等于0。
虽然布尔值只有两个，但是所有其他js类型的值，都有对应的布尔值的等价形式。可以使用特定的`Boolean()`转型函数。


|  数据类型   | 转化为true  | 转化为false
|  ----  | ----  | ---- |
| Boolean  | true | false |
| String  | 非空字符串 | ""(空字符串) |
| Number  | 非0数值（包括无穷） | 0、NaN |
| Object  | 任意对象 | Null |
| Undefined  | 不存在 | undefined |


以上转换非常重要，因为像if等语句，会自动执行其他类型到布尔值的转换。

## Number类型

在js中，`number`类型使用**IEEE 754**格式表示整数和浮点数，不同的数值类型相应的也有不同的数值字面量格式。

最基本的数值字面量格式是十进制，直接写出来即可。