---
title: JavaScript高级程序设计 - Map
date: 2021-07-01
tags:
  - JavaScript
categories:
  - JavaScript
publish: true
---

[[toc]]

# Map

作为 `ECMAScript 6` 的新增特性，`Map` 是一种新的集合类型，为这门语言带来了真正的键/值存储机制。`Map` 的大多数特性都可以通过 `Object` 类型实现，但二者之间还是存在一些细微的差异。

##

使用`new`关键字和`Map`构造函数可以创建一个空映射。

```js
const m = new Map()

// 使用嵌套数组初始化映射
const m1 = new Map([
  ['key1', 'val1'],
  ['key2', 'val2'],
  ['key3', 'val3']
])
alert(m1.size) // 3

// 使用自定义迭代器初始化映射
const m2 = new Map({
  [Symbol.iterator]: function*() {
    yield ['key1', 'val1']
    yield ['key2', 'val2']
    yield ['key3', 'val3']
  }
})
alert(m2.size) // 3

// 映射期待的键/值对，无论是否提供
const m3 = new Map([[]])
alert(m3.has(undefined)) // true
alert(m3.get(undefined)) // undefined
```

初始化之后可以使用`set()`方法再添加键值对，可以使用`get()`和`set()`进行查询，可以通过`size`获取映射中的键值对的数量，还可以使用`delete()`和`clear()`删除值。

```js
const m = new Map()
alert(m.has('firstName')) // false
alert(m.get('firstName')) // undefined
alert(m.size) // 0
m.set('firstName', 'Matt').set('lastName', 'Frisbie')
alert(m.has('firstName')) // true
alert(m.get('firstName')) // Matt
alert(m.size) // 2
m.delete('firstName') // 只删除这一个键/值对
alert(m.has('firstName')) // false
alert(m.has('lastName')) // true
alert(m.size) // 1
m.clear() // 清除这个映射实例中的所有键/值对
alert(m.has('firstName')) // false
alert(m.has('lastName')) // false
alert(m.size) // 0
```

`set()`方法返回映射实例，因此可以把多个操作连缀起来，包括初始化声明：

```js
const m = new Map().set('key1', 'val1')
m.set('key2', 'val2').set('key3', 'val3')
alert(m.size) // 3
```

`Map` 可以使用任何 `JavaScript` 数据类型作为键。

```js
const m = new Map()
const functionKey = function() {}
const symbolKey = Symbol()
const objectKey = new Object()
m.set(functionKey, 'functionValue')
m.set(symbolKey, 'symbolValue')
m.set(objectKey, 'objectValue')
alert(m.get(functionKey)) // functionValue
alert(m.get(symbolKey)) // symbolValue
alert(m.get(objectKey)) // objectValue
// SameValueZero 比较意味着独立实例不冲突
alert(m.get(function() {})) // undefined
```

## 顺序与迭代

与`Object`不同的是，`Map`实例会维护键值对的插入顺序，因此可以根据插入顺序进行迭代操作。

`Map`实例可以提供一个迭代器器`（Iterator）`，能以插入顺序生成`[key, value]`形式的数组。可以通过 `entries()`方法（或者 `Symbol.iterator` 属性，它引用 `entries()`）取得这个迭代器：

```js
const m = new Map([
  ['key1', 'val1'],
  ['key2', 'val2'],
  ['key3', 'val3']
])
alert(m.entries === m[Symbol.iterator]) // true
for (let pair of m.entries()) {
  alert(pair)
}
// [key1,val1]
// [key2,val2]
// [key3,val3]
for (let pair of m[Symbol.iterator]()) {
  alert(pair)
}
// [key1,val1]
// [key2,val2]
// [key3,val3]
```

因为 `entries()`是默认迭代器，所以可以直接对映射实例使用扩展操作，把映射转换为数组：

```js
const m = new Map([
  ['key1', 'val1'],
  ['key2', 'val2'],
  ['key3', 'val3']
])
console.log([...m]) // [[key1,val1],[key2,val2],[key3,val3]]
```

如果不使用迭代器，而是使用回调方式，则可以调用映射的 `forEach(callback, opt_thisArg)`方法并传入回调，依次迭代每个键/值对。传入的回调接收可选的第二个参数，这个参数用于重写回调内部 `this` 的值：

```js
const m = new Map([
  ['key1', 'val1'],
  ['key2', 'val2'],
  ['key3', 'val3']
])
m.forEach((val, key) => alert(`${key} -> ${val}`))
// key1 -> val1
// key2 -> val2
// key3 -> val3
```

`keys()`和 `values()`分别返回以插入顺序生成键和值的迭代器：

```js
const m = new Map([
  ['key1', 'val1'],
  ['key2', 'val2'],
  ['key3', 'val3']
])
for (let key of m.keys()) {
  alert(key)
}
// key1
// key2
// key3
for (let key of m.values()) {
  alert(key)
}
// value1
// value2
// value3
```

键和值在迭代器遍历时是可以修改的，但映射内部的引用则无法修改。当然，这并不妨碍修改作为键或值的对象内部的属性，因为这样并不影响它们在映射实例中的身份：

```js
const m1 = new Map([['key1', 'val1']])
// 作为键的字符串原始值是不能修改的
for (let key of m1.keys()) {
  key = 'newKey'
  alert(key) // newKey
  alert(m1.get('key1')) // val1
}
const keyObj = { id: 1 }
const m = new Map([[keyObj, 'val1']])
// 修改了作为键的对象的属性，但对象在映射内部仍然引用相同的值
for (let key of m.keys()) {
  key.id = 'newKey'
  alert(key) // {id: "newKey"}
  alert(m.get(keyObj)) // val1
}
alert(keyObj) // {id: "newKey"}
```

## 选择 Object 还是 Map

开发任务来说，使用`Object`还是`Map`区别不大，但是对于性能来说，两者间区别还是很大的

### 内存占用

`Object` 和 `Map` 的工程级实现在不同浏览器间存在明显差异，但存储单个键/值对所占用的内存数量都会随键的数量线性增加。批量添加或删除键/值对则取决于各浏览器对该类型内存分配的工程实现。不同浏览器的情况不同，但给定固定大小的内存，`Map` 大约可以比 `Object` 多存储 50%的键/值对。

### 插入性能

向 `Object` 和 `Map` 中插入新键/值对的消耗大致相当，不过插入 `Map` 在所有浏览器中一般会稍微快一点儿。对这两个类型来说，插入速度并不会随着键/值对数量而线性增加。如果代码涉及大量插入操作，那么显然 `Map` 的性能更佳。

### 查找速度

与插入不同，从大型 `Object` 和 `Map` 中查找键/值对的性能差异极小，但如果只包含少量键/值对，则 `Object` 有时候速度更快。在把 `Object` 当成数组使用的情况下（比如使用连续整数作为属性），浏览器引擎可以进行优化，在内存中使用更高效的布局。这对 `Map` 来说是不可能的。对这两个类型而言，查找速度不会随着键/值对数量增加而线性增加。如果代码涉及大量查找操作，那么某些情况下可能选择 `Object` 更好一些。

### 删除性能

使用 `delete` 删除 `Object` 属性的性能一直以来饱受诟病，目前在很多浏览器中仍然如此。为此，出现了一些伪删除对象属性的操作，包括把属性值设置为 `undefined` 或 `null`。但很多时候，这都是一种讨厌的或不适宜的折中。而对大多数浏览器引擎来说，`Map` 的 `delete()`操作都比插入和查找更快。如果代码涉及大量删除操作，那么毫无疑问应该选择 `Map`。