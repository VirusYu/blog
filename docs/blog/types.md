---
title: typeof instanceof 和 Object.prototype.toString判断类型的区别
date: 2021-01-25
tags:
 - JavaScript
categories:
 - JavaScript
publish: true
---
[[toc]]

## typeof

> [MDN对于`typeof`的解释](https://developer.mozilla.org/zh-cn/docs/web/javascript/reference/operators/typeof)，很官方 - *typeof 操作符返回一个字符串，表示未经计算的操作数的类型。*

如图所示`typeof`可以正确判断 `undefined`、 `function`、 `number`、 `string`、 `boolean`、 `symbol`、 `bigint`的类型，但是对于`array`、`null`的判断是都判断为object，所以如果涉及数组和`null`的判断就不能用`typeof`来判断了。

![image](/image/type/type-1.png)

JavaScript 诞生以来便如此
```js
typeof null === 'object';
```

> 在 JavaScript 最初的实现中，JavaScript 中的值是由一个表示类型的标签和实际数据值表示的。对象的类型标签是 0。由于 null 代表的是空指针（大多数平台下值为 0x00），因此，null 的类型标签是 0，typeof null 也因此返回 "object"。[（参考来源）](https://2ality.com/2013/10/typeof-null.html)

## instanceof

> [来自MDN的解释](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/instanceof) - `instanceof` 运算符用于检测构造函数的 `prototype` 属性是否出现在某个实例对象的原型链上。

用好理解的话来说就是 `instanceof` 用于检测该对象的原型链中是否可以找到该构造函数

因此，可以用`arr instanceof Array` 来判断该元素是否是数据

```js
var simpleStr = "This is a simple string";
var myString  = new String();
var newStr    = new String("String created with constructor");
var myDate    = new Date();
var myObj     = {};
var myNonObj  = Object.create(null);

simpleStr instanceof String; // 返回 false, 非对象实例，因此返回 false
myString  instanceof String; // 返回 true
newStr    instanceof String; // 返回 true
myString  instanceof Object; // 返回 true

myObj instanceof Object;    // 返回 true, 尽管原型没有定义
({})  instanceof Object;    // 返回 true, 同上
myNonObj instanceof Object; // 返回 false, 一种创建非 Object 实例的对象的方法

myString instanceof Date; //返回 false

myDate instanceof Date;     // 返回 true
myDate instanceof Object;   // 返回 true
myDate instanceof String;   // 返回 false
```

## Object.prototype.toString.call()

> 每个对象都有一个 toString() 方法，当该对象被表示为一个文本值时，或者一个对象以预期的字符串方式引用时自动调用。默认情况下，toString() 方法被每个 Object 对象继承。如果此方法在自定义对象中未被覆盖，toString() 返回 "[object type]"，其中 type 是对象的类型。[参考链接](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toString)

可以用`Object.prototype.toString.call()`来判断所有类型，像`null`,`array`,`function`之类的都可以正确判断

```js
var toString = Object.prototype.toString;
toString.call(new Date); // [object Date]
toString.call(new String); // [object String]
toString.call(Math); // [object Math]
toString.call(function(){}); // [object Function]
toString.call(undefined); // [object Undefined]
toString.call(null); // [object Null]
toString.call({});// object Object]
```