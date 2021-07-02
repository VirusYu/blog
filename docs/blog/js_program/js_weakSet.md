---
title: JavaScript高级程序设计 - WeakSet
date: 2021-07-02
tags:
  - JavaScript
categories:
  - JavaScript
publish: true
---

[[toc]]

# WeakSet

可以使用 `new` 关键字实例化一个空的 `WeakSet`：

```js
const ws = new WeakSet()
```

## 基本 API

弱集合中的值只能是 `Object` 或者继承自 `Object` 的类型，尝试使用非对象设置值会抛出 `TypeError。`初始化之后可以使用 `add()`再添加新值，可以使用 `has()`查询，还可以使用 `delete()`删除.

## 弱值

WeakSet 中“weak”表示弱集合的值是“弱弱地拿着”的。意思就是，这些值不属于正式的引用，不会阻止垃圾回收。add()方法初始化了一个新对象，并将它用作一个值。因为没有指向这个对象的其他引用，所以当这行代码执行完成后，这个对象值就会被当作垃圾回收。

## 不可迭代值

因为 WeakSet 中的值任何时候都可能被销毁，所以没必要提供迭代其值的能力。

## 使用 WeakSet

来看下面的例子，这里使用了一个普通 `Set`：

```js
const disabledElements = new Set()
const loginButton = document.querySelector('#login')
// 通过加入对应集合，给这个节点打上“禁用”标签
disabledElements.add(loginButton)
```

这样，通过查询元素在不在 `disabledElements` 中，就可以知道它是不是被禁用了。不过，假如元素从 `DOM` 树中被删除了，它的引用却仍然保存在 `Set` 中，因此垃圾回收程序也不能回收它。
为了让垃圾回收程序回收元素的内存，可以在这里使用 `WeakSet`：

```js
const disabledElements = new WeakSet()
const loginButton = document.querySelector('#login')
// 通过加入对应集合，给这个节点打上“禁用”标签
disabledElements.add(loginButton)
```

这样，只要 `WeakSet` 中任何元素从 `DOM` 树中被删除，垃圾回收程序就可以忽略其存在，而立即释放其内存（假设没有其他地方引用这个对象）。
