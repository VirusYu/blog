---
title: 手写深拷贝与浅拷贝
date: 2021-01-27
tags:
 - JavaScript
 - 前端
categories:
 - 技术分享
 - JavaScript
publish: true
---
[[toc]]

# 深拷贝与浅拷贝
相信大家多少对浅拷贝与深拷贝有一定的了解，这里就不再多赘述，通过这篇文章，希望可以加深你对深拷贝的理解。

## 数据类型

如果聊到浅拷贝与深拷贝，那么肯定得聊到`js`的数据类型，最新的 `ECMAScript` 标准定义了 8 种数据类型，其中 7 中是基本数据类型，它们是：`Boolean`、`Null`、`Undefined`、`Number`、`tring`、`BigInt`、`Symbol`。其他的如：`Array`、`Function`、 `Reg`、`Data`等都算作`Object`，详可见 MDN文档 [JavaScript 数据类型和数据结构](https://developer.mozilla.org/zh-cn/docs/web/javascript/data_structures)

### 基本类型

基本数据类型都是存储在栈（stack）内存中，栈具有先进后出的特点，基本数据类型占用空间小、大小固定，通过按值来访问，属于被频繁使用的数据。

基础类型的引用和赋值，都是按值传递的，也就是赋值后两个变量互不影响。

### 引用类型

引用数据类型 `Object`，像 `Array`、`Function`、`Date`...等都属于 `Object`，它们的值都是对象。

引用数据类型存放在堆内存中，可以直接进行访问和修改。

引用类型的赋值，在栈中复制了一份引用类型的*地址指针*，两个变量指向的还是同一个对象，所以修改了obj2.name，obj.name也会发生改变，这种改变有时候并不是我们所期望的，这时候就需要拿出我们的秘技：浅拷贝和深拷贝。

```js
let obj = { name: 'test' };
let obj2 = obj;
obj2.name = '二狗';
console.log(obj.name); // 二狗
console.log(obj2.name); // 二狗
```
## 浅拷贝

### 拓展运算符 ...

### Object.assign()

### 浅拷贝的问题

## 深拷贝

### JSON.stringify && JSON.parse 

### 手写deepClone

### 使用`weakSet`处理循环引用

### 处理 `symbol` 类型

### 处理其他引用类型