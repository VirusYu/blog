---
title: JavaScript高级程序设计 - Set
date: 2021-07-01
tags:
  - JavaScript
categories:
  - JavaScript
publish: true
---

[[toc]]

# Set

## 基本 API

使用 `new` 关键字和 `Set` 构造函数可以创建一个空集合：

```js
const m = new Set()
```

如果想在创建的同时初始化实例，则可以给 `Set` 构造函数传入一个可迭代对象，其中需要包含插入到新集合实例中的元素：

```js
// 使用数组初始化集合
const s1 = new Set(['val1', 'val2', 'val3'])
alert(s1.size) // 3
// 使用自定义迭代器初始化集合
const s2 = new Set({
  [Symbol.iterator]: function*() {
    yield 'val1'
    yield 'val2'
    yield 'val3'
  }
})
alert(s2.size) // 3
```

初始化之后，可以使用 `add()`增加值，使用 `has()`查询，通过 `size` 取得元素数量，以及使用 `delete()`和 `clear()`删除元素，`add()`返回集合的实例，所以可以将多个添加操作连缀起来。

> API 和 Map 几乎一样

与 `Map` 类似，`Set` 可以包含任何 `JavaScript` 数据类型作为值。

`add()`和 `delete()`操作是幂等的。`delete()`返回一个布尔值，表示集合中是否存在要删除的值。

## 顺序与迭代

`Set` 会维护值插入时的顺序，因此支持按顺序迭代。

集合实例可以提供一个迭代器（`Iterator`），能以插入顺序生成集合内容。可以通过 `values()`方法及其别名方法 `keys()`（或者 `Symbol.iterator` 属性，它引用 `values()`）取得这个迭代器：

```js
const s = new Set(['val1', 'val2', 'val3'])
alert(s.values === s[Symbol.iterator]) // true
alert(s.keys === s[Symbol.iterator]) // true
for (let value of s.values()) {
  alert(value)
}
// val1
// val2
// val3
for (let value of s[Symbol.iterator]()) {
  alert(value)
}
// val1
// val2
// val3
```

因为 `values()`是默认迭代器，所以可以直接对集合实例使用扩展操作，把集合转换为数组：

```js
const s = new Set(['val1', 'val2', 'val3'])
console.log([...s]) // ["val1", "val2", "val3"]
```
