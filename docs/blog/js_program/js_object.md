---
title: JavaScript高级程序设计 - Array
date: 2021-06-24
tags:
  - JavaScript
categories:
  - JavaScript
publish: true
---

[[toc]]

# Array

## 创建数组

### 通过构造函数创建数组

```js
let colors = new Array()
```

给构造函数传入一个数值，然后 length 属性就会被自动创建并设置为这个值。

```js
let colors = new Array(20)
```

也可以给 Array 构造函数传入要保存的元素：

```js
let colors = new Array('red', 'blue', 'green')
```

### 通过数组字面量创建

数组字面量是在中括号中包含以逗号分隔的元素列表：

```js
let colors = ['red', 'blue', 'green'] // 创建一个包含 3 个元素的数组
let names = [] // 创建一个空数组
let values = [1, 2] // 创建一个包含 2 个元素的数组
```

> 与对象一样，在使用数组字面量表示法创建数组不会调用 Array 构造函数。

`Array`构造函数还有两个 ES6 新增的用于创建数组的静态方法：`form`和`of`。`form`用于将类数组结构转换为数组实例，而`of`用于将一组参数转换为数组示例。

`Array.form()`的第一个参数是一个类数组对象，即任何可迭代的结构，或者有一个`length`属性和可索引元素的结构，这个方式可用于很多场合。

```js
// 字符串拆分
console.log(Array.from('Matt')) // ["M", "a", "t", "t"]
// 可以使用 from()将集合和映射转换为一个新数组
const m = new Map().set(1, 2).set(3, 4)
const s = new Set()
  .add(1)
  .add(2)
  .add(3)
  .add(4)
console.log(Array.from(m)) // [[1, 2], [3, 4]]
console.log(Array.from(s)) // [1, 2, 3, 4]

// Array.from()对现有数组执行浅拷贝
const a1 = [1, 2, 3, 4]
const a2 = Array.from(a1)
console.log(a1) // [1, 2, 3, 4]
alert(a1 === a2) // false

// 可以使用任何可迭代对象
const iter = {
  *[Symbol.iterator]() {
    yield 1
    yield 2
    yield 3
    yield 4
  }
}
console.log(Array.from(iter)) // [1, 2, 3, 4]

// arguments 对象可以被轻松地转换为数组
function getArgsArray() {
  return Array.from(arguments)
}
console.log(getArgsArray(1, 2, 3, 4)) // [1, 2, 3, 4]

// from()也能转换带有必要属性的自定义对象
const arrayLikeObject = {
  0: 1,
  1: 2,
  2: 3,
  3: 4,
  length: 4
}
console.log(Array.from(arrayLikeObject)) // [1, 2, 3, 4]
```

`Array.from()`还接收第二个可选的映射函数参数。这个函数可以直接增强新数组的值，而无须像
调用 `Array.from().map()`那样先创建一个中间数组。还可以接收第三个可选参数，用于指定映射函
数中 `this` 的值。但这个重写的 `this` 值在箭头函数中不适用。

```js
const a1 = [1, 2, 3, 4]
const a2 = Array.from(a1, x => x ** 2)
const a3 = Array.from(
  a1,
  function(x) {
    return x ** this.exponent
  },
  { exponent: 2 }
)
console.log(a2) // [1, 4, 9, 16]
console.log(a3) // [1, 4, 9, 16]
```

`Array.of()`可以把一组参数转换为数组。这个方法用于替代在 ES6 之前常用的 `Array.prototype.slice.call(arguments)`，一种异常笨拙的将 `arguments` 对象转换为数组的写法：

```js
console.log(Array.of(1, 2, 3, 4)) // [1, 2, 3, 4]
console.log(Array.of(undefined)) // [undefined]
```
