---
title: JavaScript高级程序设计 - 函数
date: 2021-07-16
tags:
  - JavaScript
categories:
  - JavaScript
publish: false
---

[[toc]]

# 函数

函数是 ECMAScript 中最有意思的部分之一，这主要是因为函数实际上是对象。每个函数都是`Function`类型的实例，而 `Function` 也有属性和方法，跟其他引用类型一样。因为函数是对象，所以函数名就是指向函数对象的指针，而且不一定与函数本身紧密绑定。

函数通常以函数声明的方式定义，比如：

```js
function sum(num1, num2) {
  return num1 + num2
}
```

另一种定义函数的语法是函数表达式。函数表达式与函数声明几乎是等价的：

```js
let sum = function(num1, num2) {
  return num1 + num2
}
```

还有一种定义函数的方式与函数表达式很像，叫作“箭头函数”（arrow function），如下所示：

```js
let sum = (num1, num2) => {
  return num1 + num2
}
```

最后一种定义函数的方式是使用 Function 构造函数。这个构造函数接收任意多个字符串参数，最后一个参数始终会被当成函数体，而之前的参数都是新函数的参数。来看下面的例子：

```js
let sum = new Function('num1', 'num2', 'return num1 + num2') // 不推荐
```

我们不推荐使用这种语法来定义函数，因为这段代码会被解释两次：第一次是将它当作常规`ECMAScript` 代码，第二次是解释传给构造函数的字符串。这显然会影响性能。不过，把函数想象为对象，把函数名想象为指针是很重要的。而上面这种语法很好地诠释了这些概念。

## 箭头函数

ECMAScript 6 新增了使用胖箭头（=>）语法定义函数表达式的能力。很大程度上，箭头函数实例化的函数对象与正式的函数表达式创建的函数对象行为是相同的。任何可以使用函数表达式的地方，都可以使用箭头函数：

```js
let arrowSum = (a, b) => {
  return a + b
}
let functionExpressionSum = function(a, b) {
  return a + b
}
console.log(arrowSum(5, 8)) // 13
console.log(functionExpressionSum(5, 8)) // 13
```

箭头函数也可以不用大括号，但这样会改变函数的行为。使用大括号就说明包含“函数体”，可以在一个函数中包含多条语句，跟常规的函数一样。如果不使用大括号，那么箭头后面就只能有一行代码，比如一个赋值操作，或者一个表达式。而且，省略大括号会隐式返回这行代码的值：

```js
// 以下两种写法都有效，而且返回相应的值
let double = (x) => { return 2 * x; };
let triple = (x) => 3 * x;
// 可以赋值
let value = {};
let setName = (x) => x.name = "Matt";
setName(value);
console.log(value.name); // "Matt"
// 无效的写法：
let multiply = (a, b) => return a * b;
```

箭头函数虽然语法简洁，但也有很多场合不适用。箭头函数不能使用 `arguments`、`super` 和`new.target`，也不能用作构造函数。此外，箭头函数也没有 `prototype` 属性。

## 函数名

因为函数名就是指向函数的指针，所以它们跟其他包含对象指针的变量具有相同的行为。这意味着一个函数可以有多个名称，如下所示：

```js
function sum(num1, num2) {
  return num1 + num2
}
console.log(sum(10, 10)) // 20
let anotherSum = sum
console.log(anotherSum(10, 10)) // 20
sum = null
console.log(anotherSum(10, 10)) // 20
```

以上代码定义了一个名为 `sum()`的函数，用于求两个数之和。然后又声明了一个变量 `anotherSum`，并将它的值设置为等于 `sum`。注意，使用不带括号的函数名会访问函数指针，而不会执行函数。此时，`anotherSum` 和 `sum` 都指向同一个函数。调用 `anotherSum()`也可以返回结果。把 `sum` 设置为 `null`之后，就切断了它与函数之间的关联。而 `anotherSum()`还是可以照常调用，没有问题。

ECMAScript 6 的所有函数对象都会暴露一个只读的 `name` 属性，其中包含关于函数的信息。多数情况下，这个属性中保存的就是一个函数标识符，或者说是一个字符串化的变量名。即使函数没有名称，也会如实显示成空字符串。如果它是使用 `Function` 构造函数创建的，则会标识成`"anonymous"`：

```js
function foo() {}
let bar = function() {}
let baz = () => {}
console.log(foo.name) // foo
console.log(bar.name) // bar
console.log(baz.name) // baz
console.log((() => {}).name) //（空字符串）
console.log(new Function().name) // anonymous
```

如果函数是一个获取函数、设置函数，或者使用 bind()实例化，那么标识符前面会加上一个前缀：

```js
function foo() {}
console.log(foo.bind(null).name) // bound foo
let dog = {
  years: 1,
  get age() {
    return this.years
  },
  set age(newAge) {
    this.years = newAge
  }
}
let propertyDescriptor = Object.getOwnPropertyDescriptor(dog, 'age')
console.log(propertyDescriptor.get.name) // get age
console.log(propertyDescriptor.set.name) // set age
```

## 理解参数

