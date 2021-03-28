---
title: JavaScript高级程序设计 - js变量
date: 2021-03-27
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

#### var声明提升

`var`在声明变量时，会将所有变量声明拉倒作用域的顶部，然后执行到对应地方再去赋值

```js

function foo(){ 
  console.log(age);
  var age = 26
}
foo() // undefined

```
以上代码等价于
```js

function foo(){ 
  var age;
  console.log(age);
  age = 26
}
foo() // undefined
```
### let 声明

### const 声明
