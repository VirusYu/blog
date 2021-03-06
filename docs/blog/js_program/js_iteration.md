---
title: JavaScript高级程序设计 - 迭代器 - 生成器
date: 2021-07-04
tags:
  - JavaScript
categories:
  - JavaScript
publish: true
---

[[toc]]

# 迭代器-生成器

`ECMAScript6` 规范新增了两个高级特性：迭代器和生成器

## 迭代器

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

迭代器是一种一次性使用的对象，用于迭代与其关联的可迭代对象。迭代器 `API` 使用 `next()`方法在可迭代对象中遍历数据。每次成功调用 `next()`，都会返回一个 `IteratorResult` 对象，其中包含迭代器返回的下一个值。若不调用 `next()`，则无法知道迭代器的当前位置。

`next()`方法返回的迭代器对象 `IteratorResult` 包含两个属性：`done` 和 `value`。`done` 是一个布
尔值，表示是否还可以再次调用 `next()`取得下一个值；`value` 包含可迭代对象的下一个值（`done` 为
`false`），或者 `undefined`（`done` 为 `true`）。`done: true` 状态称为“耗尽”。

```js
// 可迭代对象
let arr = ['foo', 'bar']
// 迭代器工厂函数
console.log(arr[Symbol.iterator]) // f values() { [native code] }
// 迭代器
let iter = arr[Symbol.iterator]()
console.log(iter) // ArrayIterator {}
// 执行迭代
console.log(iter.next()) // { done: false, value: 'foo' }
console.log(iter.next()) // { done: false, value: 'bar' }
console.log(iter.next()) // { done: true, value: undefined }
```

这里通过创建迭代器并调用 `next()`方法按顺序迭代了数组，直至不再产生新值。迭代器并不知道怎么从可迭代对象中取得下一个值，也不知道可迭代对象有多大。只要迭代器到达 `done: true` 状态，后续调用 `next()`就一直返回同样的值了：

```js
let arr = ['foo']
let iter = arr[Symbol.iterator]()
console.log(iter.next()) // { done: false, value: 'foo' }
console.log(iter.next()) // { done: true, value: undefined }
console.log(iter.next()) // { done: true, value: undefined }
console.log(iter.next()) // { done: true, value: undefined }
```

每个迭代器都表示对可迭代对象的一次性有序遍历。不同迭代器的实例相互之间没有联系，只会独立地遍历可迭代对象：

```js
let arr = ['foo', 'bar']
let iter1 = arr[Symbol.iterator]()
let iter2 = arr[Symbol.iterator]()
console.log(iter1.next()) // { done: false, value: 'foo' }
console.log(iter2.next()) // { done: false, value: 'foo' }
console.log(iter2.next()) // { done: false, value: 'bar' }
console.log(iter1.next()) // { done: false, value: 'bar' }
```

> 迭代器维护着一个指向可迭代对象的引用，因此迭代器会阻止垃圾回收程序回收可迭代对象。

### 提前终止迭代器

可选的 `return()`方法用于指定在迭代器提前关闭时执行的逻辑。

- `for-of` 循环通过 `break`、`continue`、`return` 或 `throw` 提前退出；
- 解构操作并未消费所有值。

## 生成器

### 生成器基础

生成器的形式是一个函数，函数名称前面加一个星号（\*）表示它是一个生成器。只要是可以定义函数的地方，就可以定义生成器。

```js
// 生成器函数声明
function* generatorFn() {}
// 生成器函数表达式
let generatorFn = function*() {}
// 作为对象字面量方法的生成器函数
let foo = {
  *generatorFn() {}
}
// 作为类实例方法的生成器函数
class Foo {
  *generatorFn() {}
}
// 作为类静态方法的生成器函数
class Bar {
  static *generatorFn() {}
}
```

> 箭头函数不能用来定义生成器函数。

标识生成器函数的星号不受两侧空格的影响：

```js
// 等价的生成器函数：
function* generatorFnA() {}
function *generatorFnB() {}
function * generatorFnC() {}
// 等价的生成器方法：
class Foo {
  * generatorFnD() {}
  *generatorFnE() {}
}
```

调用生成器函数会产生一个生成器对象。生成器对象一开始处于暂停执行（`suspended`）的状态。与迭代器相似，生成器对象也实现了 `Iterator` 接口，因此具有 `next()`方法。调用这个方法会让生成器开始或恢复执行。

```js
function* generatorFn() {}
const g = generatorFn();
console.log(g); // generatorFn {<suspended>}
console.log(g.next); // f next() { [native code] } 
```

### 通过 yield 中断执行

`yield` 关键字可以让生成器停止和开始执行。生成器函数在遇到 `yield`关键字之前会正常执行。遇到这个关键字后，执行会停止，函数作用域的状态会被保留。停止执行的生成器函数只能通过在生成器对象上调用 `next()`方法来恢复执行：

```js
function* generatorFn() {
 yield;
}
let generatorObject = generatorFn();
console.log(generatorObject.next()); // { done: false, value: undefined }
console.log(generatorObject.next()); // { done: true, value: undefined } 
```

此时的`yield` 关键字有点像函数的中间返回语句，它生成的值会出现在 `next()`方法返回的对象里。通过 `yield `关键字退出的生成器函数会处在 `done: false` 状态；通过 `return` 关键字退出的生成器函数会处于 `done: true` 状态。

```js
function* generatorFn() {
 yield 'foo';
 yield 'bar';
 return 'baz';
}
let generatorObject = generatorFn();
console.log(generatorObject.next()); // { done: false, value: 'foo' }
console.log(generatorObject.next()); // { done: false, value: 'bar' }
console.log(generatorObject.next()); // { done: true, value: 'baz' } 
```

生成器函数内部的执行流程会针对每个生成器对象区分作用域。在一个生成器对象上调用 `next()`不会影响其他生成器。

`yield` 关键字只能在生成器函数内部使用，用在其他地方会抛出错误。

### 生成器对象作为可迭代对象

在生成器对象上显式调用 next()`方法的用处并不大。其实，如果把生成器对象当成可迭代对象，那么使用起来会更方便：

```js
function* generatorFn() {
 yield 1;
 yield 2;
 yield 3;
}
for (const x of generatorFn()) {
 console.log(x);
}
// 1
// 2
// 3
```

### 使用 yield 实现输入和输出

除了可以作为函数的中间返回语句使用，`yield` 关键字还可以作为函数的中间参数使用。上一次让生成器函数暂停的 `yield` 关键字会接收到传给 `next()`方法的第一个值。

```js

function* generatorFn(initial) {
 console.log(initial);
 console.log(yield);
 console.log(yield);
}
let generatorObject = generatorFn('foo');
generatorObject.next('bar'); // foo
generatorObject.next('baz'); // baz
generatorObject.next('qux'); // qux
yield 关键字可以同时用于输入和输出，如下例所示：
function* generatorFn() {
 return yield 'foo';
}
let generatorObject = generatorFn();
console.log(generatorObject.next()); // { done: false, value: 'foo' }
console.log(generatorObject.next('bar')); // { done: true, value: 'bar' } 
```

### 提前终止生成器

与迭代器类似，生成器也支持“可关闭”的概念。一个实现 `Iterator` 接口的对象一定有 `next()`方法，还有一个可选的 `return()`方法用于提前终止迭代器。生成器对象除了有这两个方法，还有第三个方法：`throw()`。

```js
function* generatorFn() {}
const g = generatorFn();
console.log(g); // generatorFn {<suspended>}
console.log(g.next); // f next() { [native code] }
console.log(g.return); // f return() { [native code] }
console.log(g.throw); // f throw() { [native code] } 
```
return()和 throw()方法都可以用于强制生成器进入关闭状态。