---
title: JavaScript高级程序设计 - 变量
date: 2021-06-07
tags:
  - JavaScript
categories:
  - JavaScript
publish: true
---

[[toc]]

## 原始值与引用值

`ECMAScript`变量包含两种不同类型的数据：*原始值*和*引用值*。

*原始值*就是最简单的数据，*引用值*则是由多个值构成的对象。

把一个值赋给变量的时候，js 引擎必须确定这个值是原始值还是引用值。一共有六种原始值：`Undefined`,`Null`,`Boolean`,`Number`,`String`,`Symbol`。保存原始值的变量是按值访问的，操作的就是存储在变量中的实际值。

引用值是保存在内存中的对象。js 不允许直接访问内存地址，因此也就不能直接操作对象所在的内存空间。在操作对象时，实际上操作的是对该对象的引用，而非对象本身。为此，保存引用值的变量是按引用访问的。

## 动态属性

原始值和引用值的定义方式很类似，都是创建一个变量，然后给它赋一个值。对于引用值而言，可以随时添加、修改和删除其属性和方法。

```js
let person = new Object()
person.name = 'Nicholas'
console.log(person.name) // "Nicholas"
```

原始值不能有属性，尽管尝试给原始值添加属性不会报错。比如：

```js
let name = 'Nicholas'
name.age = 27
console.log(name.age) // undefined
```

注意，原始类型的初始化可以只使用原始字面量形式。如果使用的是 `new` 关键字，则 `JavaScript` 会创建一个 `Object` 类型的实例，但其行为类似原始值。下面来看看这两种初始化方式的差异：

```js
let name1 = 'Nicholas'
let name2 = new String('Matt')
name1.age = 27
name2.age = 26
console.log(name1.age) // undefined
console.log(name2.age) // 26
console.log(typeof name1) // string
console.log(typeof name2) // object
```

## 复制值

除了存储方式不同，原始值和引用值在通过变量复制时也有所不同。在通过变量把一个原始值赋值到另一个变量时，原始值会被复制到新变量的位置。

```js
let num1 = 5
let num2 = num1
```

这里，`num1` 包含数值 5。当把 `num2` 初始化为 `num1` 时，`num2` 也会得到数值 5。这个值跟存储在`num1` 中的 5 是完全独立的，因为它是那个值的副本。

把引用值从一个变量赋值给另一个变量时，存储在变量中的值也会被复制到新变量所在的位置，区别是引用类型复制的其实是一个指针，指针指向存储在堆内存中的对象。

操作完成后，两个变量实际指向同一个对象，因此对一个对象的属性进行操作，另一个对象对应的属性也会发生变化。因为他们引用的是同一个对象。

## 传递参数

所有函数的参数都是按值传递的。函数外的值通过参数传入时，会像复制变量一样，同样的引用类型也是复制的指针。

```js
function addTen(num) {
  num += 10
  return num
}
let count = 20
let result = addTen(count)
console.log(count) // 20，没有变化
console.log(result) // 30
```

```js
function setName(obj) {
  obj.name = 'Nicholas'
}
let person = new Object()
setName(person)
console.log(person.name)
```

## 确定类型

`typeof`操作符最适合用来判断一个变量是否为原始类型。更确切地说，它是判断一个变量是否为字符串、数值、布尔值或 `undefined` 的最好方式。如果值是对象或 `null`，那么 `typeof`返回`"object"`，如下面的例子所示：

```js
let s = 'Nicholas'
let b = true
let i = 22
let u
let n = null
let o = new Object()
console.log(typeof s) // string
console.log(typeof i) // number
console.log(typeof b) // boolean
console.log(typeof u) // undefined
console.log(typeof n) // object
console.log(typeof o) // object
```

为了解决以上问题，我们可以使用`instanceof`操作符，用法如下：

```js
console.log(person instanceof Object)
console.log(colors instanceof Array)
console.log(pattern instanceof RegExp)
```

按照定义，所有引用值都是 `Object` 的实例，因此通过 `instanceof` 操作符检测任何引用值和`Object` 构造函数都会返回 `true`。如果用 `instanceof` 检测原始值，则始终会返回 `false`，因为原始值不是对象。
