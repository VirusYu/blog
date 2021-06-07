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
let num1 = 5;
let num2 = num1;
```
这里，`num1` 包含数值 5。当把 `num2` 初始化为 `num1` 时，`num2` 也会得到数值 5。这个值跟存储在`num1` 中的 5 是完全独立的，因为它是那个值的副本。

