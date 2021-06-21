---
title: JavaScript高级程序设计 - 垃圾回收
date: 2021-06-21
tags:
  - JavaScript
categories:
  - JavaScript
publish: true
---

[[toc]]

# 垃圾回收

`JavaScript` 是使用垃圾回收的语言，也就是说执行环境负责在代码执行时管理内存。基本思路很简单：确定哪个变量不会再使用，然后释放它占用的内存。这个过程是周期性的，即垃圾回收程序每隔一定时间（或者说在代码执行过程中某个预定的收集时间）就会自动运行。

## 标记清理

当变量进入上下文，比如在函数内部声明一个变量时，这个变量会被加上存在于上下文中的标记。而在上下文中的变量，逻辑上讲，永远不应该释放它们的内存，因为只要上下文中的代码在运行，就有可能用到它们。当变量离开上下文时，也会被加上离开上下文的标记。

垃圾回收程序运行的时候，会标记内存中存储的所有变量（记住，标记方法有很多种）。然后，它会将所有在上下文中的变量，以及被在上下文中的变量引用的变量的标记去掉。在此之后再被加上标记的变量就是待删除的了，原因是任何在上下文中的变量都访问不到它们了。随后垃圾回收程序做一次内存清理，销毁带标记的所有值并收回它们的内存。

## 引用计数

另一种没那么常用的垃圾回收策略是引用计数（reference counting）。其思路是对每个值都记录它被引用的次数。声明变量并给它赋一个引用值时，这个值的引用数为 1。如果同一个值又被赋给另一个变量，那么引用数加 1。类似地，如果保存对该值引用的变量被其他值给覆盖了，那么引用数减 1。当一个值的引用数为 0 时，就说明没办法再访问到这个值了，因此可以安全地收回其内存了。垃圾回收程序下次运行的时候就会释放引用数为 0 的值的内存。

### 引用计数存在的问题

#### 循环引用

循环引用就是对象 A 有一个指针指向对象 B，而对象 B 也引用了对象 A。比如：

```js
function problem() {
  let objectA = new Object()
  let objectB = new Object()
  objectA.someOtherObject = objectB
  objectB.anotherObject = objectA
}
```

在这个例子中，`objectA` 和 `objectB` 通过各自的属性相互引用，意味着它们的引用数都是 2。在标记清理策略下，这不是问题，因为在函数结束后，这两个对象都不在作用域中。而在引用计数策略下，`objectA` 和 `objectB` 在函数结束后还会存在，因为它们的引用数永远不会变成 0。如果函数被多次调用，则会导致大量内存永远不会被释放。

在 `IE8` 及更早版本的 `IE` 中，并非所有对象都是原生 `JavaScript` 对象。`BOM` 和 `DOM`中的对象是 `C++`实现的组件对象模型（`COM`，`Component Object Model`）对象，而 `COM` 对象使用引用计数实现垃圾回收。因此，即使这些版本 `IE` 的 `JavaScript` 引擎使用标记清理，`JavaScript` 存取的 COM 对象依旧使用引用计数。换句话说，只要涉及 `COM` 对象，就无法避开循环引用问题。

```js
let element = document.getElementById('some_element')
let myObject = new Object()
myObject.element = element
element.someObject = myObject
```

## GC 性能优化

- 通过将不再使用的数据设置为`null`来释放内存
- 通过`const`和`let`声明提升性能（块级作用域使 GC 尽早介入）
- 隐藏类和删除操作

### 隐藏类

根据 `JavaScript` 所在的运行环境，有时候需要根据浏览器使用的 `JavaScript` 引擎来采取不同的性能优化策略。截至 2017 `年，Chrome` 是最流行的浏览器，使用 `V8` `JavaScript` 引擎。`V8` 在将解释后的 `JavaScript`代码编译为实际的机器码时会利用“隐藏类”。如果你的代码非常注重性能，那么这一点可能对你很重要。

V8 会针对这种情况进行优化，但不一定总能够做到。比如下面的代码：

```js
function Article() {
  this.title = 'Inauguration Ceremony Features Kazoo Band'
}
let a1 = new Article()
let a2 = new Article()
```

V8 会在后台配置，让这两个类实例共享相同的隐藏类，因为这两个实例共享同一个构造函数和原型。假设之后又添加了下面这行代码：

```js
a2.author = 'Jake'
```

此时两个 `Article` 实例就会对应两个不同的隐藏类。根据这种操作的频率和隐藏类的大小，这有可能对性能产生明显影响。

当然，解决方案就是避免 `JavaScript` 的“先创建再补充”`（ready-fire-aim）`式的动态属性赋值，并在
构造函数中一次性声明所有属性，如下所示：

```js
function Article(opt_author) {
  this.title = 'Inauguration Ceremony Features Kazoo Band'
  this.author = opt_author
}
let a1 = new Article()
let a2 = new Article('Jake')
```

使用 delete 关键字会导致生成相同的隐藏类片段。看一下这个例子：

```js
function Article() {
  this.title = 'Inauguration Ceremony Features Kazoo Band'
  this.author = 'Jake'
}
let a1 = new Article()
let a2 = new Article()
delete a1.author
```

在代码结束后，即使两个实例使用了同一个构造函数，它们也不再共享一个隐藏类。动态删除属性与动态添加属性导致的后果一样。最佳实践是把不想要的属性设置为 `null`。

```js
function Article() {
  this.title = 'Inauguration Ceremony Features Kazoo Band'
  this.author = 'Jake'
}
let a1 = new Article()
let a2 = new Article()
a1.author = null
```
