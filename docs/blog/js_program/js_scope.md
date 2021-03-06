---
title: JavaScript高级程序设计 - 执行上下文与作用域
date: 2021-06-11
tags:
  - JavaScript
categories:
  - JavaScript
publish: true
---

[[toc]]

## 执行上下文与作用域

变量或者函数的上下文决定他们可以访问那些数据，以及他们的行为。每个上下文都有一个关联的*变量对象*，而这个上下文中定义的所有变量和函数都存在于这个对象上。不过这个对象无法通过代码访问，不过浏览器回来执行过程中用到。

全局上下文是最外层的上下文。根据`ECMAScript`实现的宿主环境，表示全局上下文的对象可能不一样。在浏览器中全局上下文就是常说的`window`对象。所有通过`var`定义的全局变量和函数都会成为`window`对象的属性和方法。

使用`let`和`const`的顶级声明不会定义在全局上下文中，但是在作用域解析上效果是一样的。上下文在其所有代码都执行完毕后会被销毁，包括定义在它上面的所有变量和函数，全局上下文在应用退出前才会销毁，比如关闭网页或退出浏览器。

每个函数调用都有自己的上下文，当代码执行流进入函数时，函数的上下文被推倒一个上下文栈上，在函数执行完之后，上下文栈会弹出该函数上下文，将控制权返还给之前的执行上下文。`ECMAScript`的执行流就是通过这个上下文栈进行控制的。

上下文代码执行时，会创建变量对象的一个*作用域链*。这个作用域链决定了各级上下文中的代码在访问变量和函数时的顺序。代码正在执行的上下文的变量对象始终位于作用域的最前端。

如果上下文是函数，则其*活动对象（activation object）*用作变量对象。活动对象最初只有一个定义变量：`arguments`。（全局上下文中没有这个变量。）作用域链中的下一个变量对象来自包含上下文，再下一个对象来自下一个包含上下文，以此类推直到全局上下文，全局上下文的变量对象始终是作用域链的最后一个变量对象。

代码执行时的标识符解析是通过沿作用域链逐级搜索标识符名称完成的。搜索过程始终从作用域链的最前端开始，然后逐级往后，知道找到标识符，如果没有找到标识符，那么通常会报错。

看一下例子：

```js
var color = 'blue'
function changeColor() {
  if (color === 'blue') {
    color = 'red'
  } else {
    color = 'blue'
  }
}
changeColor()
```

对这个例子而言，函数 `changeColor()`的作用域链包含两个对象：一个是它自己的变量对象（就是定义 arguments 对象的那个），另一个是全局上下文的变量对象。这个函数内部之所以能够访问变量`color`，就是因为可以在作用域链中找到它。

此外，局部作用域中定义的变量可用于在局部上下文中替换全局变量。

```js
var color = 'blue'
function changeColor() {
  let anotherColor = 'red'
  function swapColors() {
    let tempColor = anotherColor
    anotherColor = color
    color = tempColor
    // 这里可以访问 color、anotherColor 和 tempColor
  }
  // 这里可以访问 color 和 anotherColor，但访问不到 tempColor
  swapColors()
}
// 这里只能访问 color
changeColor()
```

内部上下文可以通过作用域链访问外部上下文中的一切。但是外部上下文无法访问内部上下文中的任何东西。上下文之间的连接是线性的、有序的。每个上下文都可以到上一级上下文中去搜索变量和函数，但是任何上下文都补鞥呢到下一级上下文中去搜索。

> 函数参数被认为是当前上下文中的变量，因此也跟上下文中的其他变量遵循相同的访问规则。

### 作用域链增强

虽然执行上下文主要有全局上下文和函数上下文两种，但是又其他方式来增强作用域链。某些语句会导致在作用域前端临时添加一个上下文，这个上下文在代码执行后会删除。

- `try/catch`的`catch`块
- `with`语句

这两种情况都会在作用域链前端添加一个变量对象。对于`with`语句来说会向作用域链前端增加指定的对象；对于`catch`来说则会创建一个新的变量对象，这个变量对象会包含要抛出的错误对象的声明。

```js
function buildUrl() {
  let qs = '?debug=true'
  with (location) {
    let url = href + qs
  }
  return url
}
```

`with` 语句将 `location` 对象作为上下文，因此 `location` 会被添加到作用域链前端。`buildUrl()`函数中定义了一个变量 `qs`。当 `with` 语句中的代码引用变量 href 时，实际上引用的是`location.href`，也就是自己变量对象的属性。在引用 `qs` 时，引用的则是定义在 `buildUrl()`中的那个变量，它定义在函数上下文的变量对象上。而在 `with` 语句中使用 `var` 声明的变量 `url` 会成为函数上下文的一部分，可以作为函数的值被返回；但像这里使用 `let` 声明的变量 `url`，因为被限制在块级作用域（稍后介绍），所以在 `with` 块之外没有定义。

### 变量声明
参考之前文章
