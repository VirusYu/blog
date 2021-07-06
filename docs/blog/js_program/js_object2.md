---
title: JavaScript高级程序设计 - 创建对象
date: 2021-07-06
tags:
  - JavaScript
categories:
  - JavaScript
publish: true
---

[[toc]]

# 创建对象

虽然使用 Object 构造函数或对象字面量可以方便地创建对象，但这些方式也有明显不足：创建具有同样接口的多个对象需要重复编写很多代码。

## 概述

`ECMAScript 6` 开始正式支持类和继承。`ES6` 的类旨在完全涵盖之前规范设计的基于原型的继承模式。不过，无论从哪方面看，`ES6` 的类都仅仅是封装了 `ES5.1` 构造函数加原型继承的语法糖而已。

## 工厂模式

工厂模式是一种众所周知的设计模式，广泛应用于软件工程领域，用于抽象创建特定对象的过程。

```js
function createPerson(name, age, job) {
  let o = new Object()
  o.name = name
  o.age = age
  o.job = job
  o.sayName = function() {
    console.log(this.name)
  }
  return o
}
let person1 = createPerson('Nicholas', 29, 'Software Engineer')
let person2 = createPerson('Greg', 27, 'Doctor')
```

这里，函数 `createPerson()`接收 3 个参数，根据这几个参数构建了一个包含 `Person` 信息的对象。可以用不同的参数多次调用这个函数，每次都会返回包含 3 个属性和 1 个方法的对象。这种工厂模式虽然可以解决创建多个类似对象的问题，但没有解决对象标识问题（即新创建的对象是什么类型）。

## 构造函数模式

