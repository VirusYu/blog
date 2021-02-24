---
title: 面试题 - js任务队列
date: 2021-02-23
tags:
 - JavaScript
categories:
 - JavaScript
publish: true
---
[[toc]]

## 前言

小伙伴在群里分享了一个题目，如下。乍一看感觉很简单，就一个链式调用，当时想直接一个构造函数，然后每个方法里`return this`就好了，结果一看，还有个`sleep`，`sleep`时后面代码不执行，当时我？？？，直接就傻了。后来提醒我可以用任务队列去处理，在研究我岳哥代码、查了n多文档后，才感觉明白了，话不多说上代码。

```js
//实现一个LazyMan，可以按照以下方式调用:
LazyMan('Hank')
// Hi! This is Hank!
LazyMan('Hank').sleep(10).eat('dinner')
// Hi! This is Hank!
//等待10秒..
// Wake up after 10
// Eat dinner~
LazyMan('Hank').eat('dinner').eat('supper')
// Hi This is Hank!
// Eat dinner~
// Eat supper~
LazyMan('Hank').sleepFirst(5).eat('supper')
// 等待5秒
// Wake up after 5
// Hi This is Hank!
// Eat supper
```

## 实现链式调用

先实现一个基础的`class`，可以实现`log`和链式调用

```js
class LazyManClass {
  sayHello(name) {
    console.log(`Hi!This is ${name}~`)
    return this
  }

  eat(food) {
    console.log(`Eat ${food}~`)
    return this
  }
}
```

## 实现任务队列

通过维护一个任务队列，每次调用方法都会往任务队列里去添加一个箭头函数，需要注意的是
 - 在`sleep`时，去`push`一个`promise`，在定时器里去`resolve`，在`run`方法里去通过`async`、`await`去实现同步
 - 在`LazyMan`函数中，执行时可以发现通过`queueMicrotask`去手动维护了一个微任务，这样在`run`的时候，任务队列里就会有所有的操作
```js
class LazyManClass {
  taskQueue = []

  sayHello(name) {
    this.taskQueue.push(() => console.log(`Hi!This is ${name}~`))
    return this
  }

  eat(food) {
    this.taskQueue.push(() => console.log(`Eat ${food}~`))
    return this
  }

  sleep(wait) {
    this.taskQueue.push(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            console.log(`Wake up after ${wait}`)
            resolve()
          }, wait * 1000)
        })
    )
    return this
  }

  sleepFirst(wait) {
    this.taskQueue.unshift(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            console.log(`Wake up after ${wait}`)
            resolve()
          }, wait * 1000)
        })
    )
    return this
  }

  async run() {
    while (this.taskQueue.length) {
      await this.taskQueue.shift()()
    }
    return this
  }
}

function LazyMan(name) {
  const _lazyMan = new LazyManClass()
  if (name) {
    _lazyMan.sayHello(name)
  }
  queueMicrotask(() => _lazyMan.run())
  return _lazyMan
}

LazyMan('Hank').eat('apple').sleep(3).eat('dinner').sleepFirst(1)

```