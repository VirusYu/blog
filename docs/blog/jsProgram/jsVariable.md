---
title: JavaScript高级程序设计 - js变量
date: 2021-03-28
tags:
  - JavaScript
categories:
  - JavaScript
publish: true
---

[[toc]]

## 变量

`ECMAScript`变量是松散类型，意思是变量可以声明任何类型的数据。每个变量不过是用于保存任意值的命名占位符，可以通过`var`、`let`、`const`来声明变量，其中`var`可以再任何版本中使用，而`let`和`const`只能在 ES6 以上版本中才可以使用。

### var 关键字

```js
var message
```

这行代码命名了一个名为`message`的变量，可以用它保存任何类型的值，不初始化的情况下会保存一个特殊值`undefined`。

```js
var message = 'hello world'
```

`ECMAScript`实现变量初始化，因此可以在定义变量的同时去设置它的值。

```js
var message = 'hello world'
message = 100
```

一开始`message`被定义并保存为一个字符串值为`'hello world'`的变量，然后被重写为值为 100 的数字，虽然这种写法不推荐，但是在 js 中这是完全生效的。

#### var 声明作用域

使用 var 操作符定义的变量，会成为包含他的函数的局部变量。比如，使用`var`在一个函数内部定义一个变量，就意味着该变量会在函数退出时销毁。

```js
function test() {
  var message = 'hi'
}
test()
console.log(message) // 报错
```

在上一行代码里，在函数`test`中定义了一个变量`message`，调用`test`方法会在内部创建一个名为`message`的变量，会在`test`方法调用结束之后销毁，所以最后一行会报错。不过，如果在函数内部定义变量是省略`var`操作符，会创建一个全局变量

```js
function test() {
  message = 'hi'
}
test()
console.log(message) // hi
```

> 虽然可以忽略`var`操作符来定义全局变量，但是这样会使代码难以维护，而且会在严格模式下报错。

#### var 声明提升

`var`在声明变量时，会将所有变量声明拉倒作用域的顶部，然后执行到对应地方再去赋值

```js
function foo() {
  console.log(age)
  var age = 26
}
foo() // undefined
```

以上代码等价于

```js
function foo() {
  var age
  console.log(age)
  age = 26
}
foo() // undefined
```

### let 声明

#### let 和 var 区别 - 作用域

`let`跟`var`最明显的区别就是，`let`声明的范围是块作用域，`var`是函数作用域。

```js
if (true) {
  var name = 'Matt'
  console.log(name) // Matt
}
console.log(name) // Matt

if (true) {
  let age = 26
  console.log(age) // 26
}
console.log(age) // err
```

`let`不允许同一个块级作用域中出现冗余声明

```js
var name
var name
// nothing

let age
let age
// SyntaxError
```

#### let 和 var 区别 - 暂时性死区

`let`声明的变量不会在作用域中被提升，在`let`声明之前的执行瞬间被称为“暂时性死区”。

```js
console.log(name) // undefined
var name = 'Matt'

console.log(age)
let age = 26 // ReferenceError： age没有定义
```

#### let 和 var 区别 - 全局声明

与`var`不同，使用`let`在全局作用域中声明的变量不会成为`window`对象的属性

```js
var name = 'Matt'
console.log(window.name) // 'Matt'

let age = 26
console.log(window.age) // undefined
```

#### let 和 var 区别 - 条件声明

在使用`var`声明变量的时候，由于会发生变量提升，JS 引擎会自动将多余的声明在作用域顶部合并为一个声明。因为`let`是块级作用域，所以不可能检查前面是否已经使用`let`声明过同名变量，同时也就不可能在没有声明的情况下声明它。

```js
var name = 'Mate'
let age = 26

var name = 'ErGou' // 没有问题， 因为变量声明会提升
let age = 26 // 之前已经用let声明过age了，就会报错
```

#### let 和 var 区别 - for 循环中的 let 声明

在`let`出现之前，`for`循环定义的迭代变量，会渗透到循环体外部，改成使用`let`之后这个问题就解决了，因为迭代变量的作用域仅限于`for`循环块内

```js
for (var i = 0; i < 5; i++) {
  // do something
}
console.log(i) // 5

for (let i = 0; i < 5; i++) {
  // do something
}
console.log(i) //  ReferenceError： i没有定义
```

### const 声明

`const`和`let`基本相同，唯一一个重要区别就是，它声明变量时必须同时初始化变量，且尝试修改`const`声明的变量则会导致运行时报错。

```js
const age = 26
age = 36 // TypeError 给常量赋值

const name = 'a'
const name = 'b' // SyntaxError const不允许重复声明

const name = 'Matt'
if(true){
  const name = 'ErGou'
}
console.log(name) // Matt  const作用域也是块
```
`const`声明的限制只适用于它指向的变量的引用，换句话说，如果`const`变量引用的是一个对象，那么修改这个对象内部的数据并不违反`const` 的限制，因为对象的引用地址始终都没有改变。