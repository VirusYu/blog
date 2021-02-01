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

浅拷贝就是将对象中的属性拷贝一份，如果属性是基础类型，直接复制该属性，如果属性是引用类型，则复制该属性对应的内存地址，下面介绍几种常用的浅拷贝方法。

### 拓展运算符 ...

现代化开发中最常用的浅拷贝就是*拓展运算符*`...`了，[mdn文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Spread_syntax)

```js
var arr = [1, 2, 3];
var arr2 = [...arr]; // like arr.slice()
arr2.push(4);
```

### Object.assign()

`Object.assign()` 方法用于将所有可枚举属性的值从一个或多个源对象分配到目标对象，它将返回目标对象。[mdn文档](https://developer.mozilla.org/zh-cn/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)

一般开发中会用来合并对象，如果有相同属性，则会以后面对象的值为准。

```js
const target = { a: 1, b: 2 };
const source = { b: 4, c: 5 };

const returnedTarget = Object.assign(target, source);

console.log(target);
// expected output: Object { a: 1, b: 4, c: 5 }

console.log(returnedTarget);
// expected output: Object { a: 1, b: 4, c: 5 }

```

### `concat`和`slice`

```js
let arr = [1, 2];
let arr2 = arr.concat();
arr.push(3);
console.log(arr); // [1, 2, 3]
console.log(arr2); // [1, 2]
```

```js
let arr = [1, 2];
let arr2 = arr.slice();
arr.push(3);
console.log(arr); // [1, 2, 3]
console.log(arr2); // [1, 2]

```
### 浅拷贝的问题

再进行浅拷贝时，对于引用类型，拷贝的是引用的内存地址，那如果拷贝之后，再去修改原对象的引用类型，在新对象中对应的值也会发生变化，这时候我们就需要用到深拷贝了。

```js
let obj = { name: '二狗', hobby: ['撸代码'] };
let obj2 = { ...obj };
obj2.name = '三狗';
console.log(obj.name); // 二狗
console.log(obj2.name); // 三狗

obj.hobby.push('打游戏');
console.log(obj.hobby); // ['撸代码', '打游戏']
console.log(obj2.hobby);// ['撸代码', '打游戏']
console.log(obj.hobby === obj2.hobby); // true

```

## 深拷贝

深拷贝，顾名思义就是比浅拷贝能够更深层级的拷贝，它能够将拷贝过程中遇到的引用类型都新开辟一块地址拷贝对应的数据，这样就能避免子对象共享同一份内存的问题了。

### JSON.stringify && JSON.parse 

基于`JSON.stringify`将对象先转成字符串，再通过`JSON.parse`将字符串转成对象，此时对象中每个层级的堆内存都是新开辟的。

```js
let obj = { name: '二狗', hobby: ['撸代码'] };
let obj2 = JSON.parse(JSON.stringify(obj));
obj2.name = '三狗';
console.log(obj.name); // 二狗
console.log(obj2.name); // 三狗

obj.hobby.push('打游戏');
console.log(obj.hobby); // ['撸代码', '打游戏']
console.log(obj2.hobby);// ['撸代码'']
```

这种方法虽然简单，但是也有不适用的场景：
 - 不能解决循环引用的问题
 - 无法拷贝特殊对象，比如：`RegExp`、`undefined`、`function`、`RegExp`、`Map`等

### 手写deepClone

既然使用`JSON.stringify && JSON.parse `无法满足所有场景的话，那我们就自己实现一个深拷贝。

实现深拷贝之前先思考下应该怎么如何实现，其实核心就是：浅拷贝 + 递归。

 - 对于基本数据类型，我们直接拷贝即可
 - 对于引用数据类型，则需要进行递归拷贝。

### 使用`weakSet`处理循环引用

### 处理 `symbol` 类型

### 处理其他引用类型