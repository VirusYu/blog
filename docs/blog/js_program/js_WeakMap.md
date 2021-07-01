---
title: JavaScript高级程序设计 - WeakMap
date: 2021-07-01
tags:
  - JavaScript
categories:
  - JavaScript
publish: true
---

[[toc]]

# WeakMap

`ECMAScript 6` 新增的“弱映射”（`WeakMap`）是一种新的集合类型，为这门语言带来了增强的键/`值对存储机制。WeakMap` 是 `Map` 的“兄弟”类型，其 API 也是 `Map` `的子集。WeakMap` 中的“weak”（弱），描述的是 `JavaScript` 垃圾回收程序对待“弱映射”中键的方式。

## 基本 API

可以使用 `new` 关键字实例化一个空的 `WeakMap`:

```js
const wm = new WeakMap()
```

弱映射中的键只能是 `Object` 或者继承自 `Object` 的类型，尝试使用非对象设置键会抛出`TypeError`。值的类型没有限制。

```js
const key1 = { id: 1 },
  key2 = { id: 2 },
  key3 = { id: 3 }
// 使用嵌套数组初始化弱映射
const wm1 = new WeakMap([
  [key1, 'val1'],
  [key2, 'val2'],
  [key3, 'val3']
])
alert(wm1.get(key1)) // val1
alert(wm1.get(key2)) // val2
alert(wm1.get(key3)) // val3
// 初始化是全有或全无的操作
// 只要有一个键无效就会抛出错误，导致整个初始化失败
const wm2 = new WeakMap([
  [key1, 'val1'],
  ['BADKEY', 'val2'],
  [key3, 'val3']
])
// TypeError: Invalid value used as WeakMap key
typeof wm2
// ReferenceError: wm2 is not defined
// 原始值可以先包装成对象再用作键
const stringKey = new String('key1')
const wm3 = new WeakMap([stringKey, 'val1'])
alert(wm3.get(stringKey)) // "val1"
```

初始化之后可以使用 `set()`再添加键/值对，可以使用 `get()`和 `has()`查询，还可以使用 `delete()`删除：

```js
const wm = new WeakMap()
const key1 = { id: 1 },
  key2 = { id: 2 }
alert(wm.has(key1)) // false
alert(wm.get(key1)) // undefined
wm.set(key1, 'Matt').set(key2, 'Frisbie')
alert(wm.has(key1)) // true
alert(wm.get(key1)) // Matt
wm.delete(key1) // 只删除这一个键/值对
alert(wm.has(key1)) // false
alert(wm.has(key2)) // true
```

## 弱键

WeakMap 中“weak”表示弱映射的键是“弱弱地拿着”的。意思就是，这些键不属于正式的引用，不会阻止垃圾回收。但要注意的是，弱映射中值的引用可不是“弱弱地拿着”的。只要键存在，键/值对就会存在于映射中，并被当作对值的引用，因此就不会被当作垃圾回收。

## 不可迭代键

因为 `WeakMap` 中的键/值对任何时候都可能被销毁，所以没必要提供迭代其键/值对的能力。
