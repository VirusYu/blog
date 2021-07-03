---
title: JavaScript高级程序设计 - 迭代器
date: 2021-07-02
tags:
  - JavaScript
categories:
  - JavaScript
publish: true
---

[[toc]]

#

`ECMAScript6` 规范新增了两个高级特性：迭代器和生成器

## 迭代器模式

迭代器模式描述了一个方案，既可以把有些结构成为可迭代对象，因为它们实现了正式的 `Iterable` 接口，而且可以通过迭代器 `Iterator` 消费。

任何实现 `Iterable` 接口的数据结构都可以被实现 `Iterator` 接口的结构“消费”

`迭代器`（iterator）是按需创建的一次性对象。每个迭代器都会关联一个可迭代对象，而迭代器会暴露迭代其关联可迭代对象的 API。

### 可迭代协议

实现 `Iterable` 接口（可迭代协议）要求同时具备两种能力：支持迭代的自我识别能力和创建实现`Iterator` 接口的对象的能力。

这意味着必须暴露一个属性作为“默认迭代器”，而且这个属性必须使用特殊的 `Symbol.iterator` 作为键。

很多内置类型都实现了 `Iterable` 接口：

- 字符串
- 数组
- Map
- Set
- arguments 对象
- NodeList 等 DOM 集合类型

```js
let str = 'abc'
let arr = ['a', 'b', 'c']
let map = new Map()
  .set('a', 1)
  .set('b', 2)
  .set('c', 3)
let set = new Set()
  .add('a')
  .add('b')
  .add('c')
let els = document.querySelectorAll('div')
// 这些类型都实现了迭代器工厂函数
console.log(str[Symbol.iterator]) // f values() { [native code] }
console.log(arr[Symbol.iterator]) // f values() { [native code] }
console.log(map[Symbol.iterator]) // f values() { [native code] }
console.log(set[Symbol.iterator]) // f values() { [native code] }
console.log(els[Symbol.iterator]) // f values() { [native code] }
// 调用这个工厂函数会生成一个迭代器
console.log(str[Symbol.iterator]()) // StringIterator {}
console.log(arr[Symbol.iterator]()) // ArrayIterator {}
console.log(map[Symbol.iterator]()) // MapIterator {}
console.log(set[Symbol.iterator]()) // SetIterator {}
console.log(els[Symbol.iterator]()) // ArrayIterator {}
```

实际写代码过程中，不需要显式调用这个工厂函数来生成迭代器。实现可迭代协议的所有类型都会自动兼容接收可迭代对象的任何语言特性。接收可迭代对象的原生语言特性包括：

- for-of 循环
- 数组解构
- 拓展操作符
- Array.from()
- new Map()
- new Set()
- Promise.all()接收由`Promise`组成的可迭代对象
- Promise.race()接收由`Promise`组成的可迭代对象
- yield\*操作符，在生成器中使用

```js
let arr = ['foo', 'bar', 'baz']
// for-of 循环
for (let el of arr) {
  console.log(el)
}
// foo
// bar
// baz
// 数组解构
let [a, b, c] = arr
console.log(a, b, c) // foo, bar, baz
// 扩展操作符
let arr2 = [...arr]
console.log(arr2) // ['foo', 'bar', 'baz']
// Array.from()
let arr3 = Array.from(arr)
console.log(arr3) // ['foo', 'bar', 'baz']
// Set 构造函数
let set = new Set(arr)
console.log(set) // Set(3) {'foo', 'bar', 'baz'}
// Map 构造函数
let pairs = arr.map((x, i) => [x, i])
console.log(pairs) // [['foo', 0], ['bar', 1], ['baz', 2]]
let map = new Map(pairs)
console.log(map) // Map(3) { 'foo'=>0, 'bar'=>1, 'baz'=>2 }
```

如果对象原型链上的父类实现了 `Iterable` 接口，那这个对象也就实现了这个接口：

```js
class FooArray extends Array {}
let fooArr = new FooArray('foo', 'bar', 'baz')
for (let el of fooArr) {
  console.log(el)
}
// foo
// bar
// baz
```

### 迭代器协议

