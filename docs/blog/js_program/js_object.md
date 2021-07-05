---
title: JavaScript高级程序设计 - Object
date: 2021-07-05
tags:
  - JavaScript
categories:
  - JavaScript
publish: true
---

[[toc]]

# 对象

## 数据属性

数据属性包含一个保存数据值的位置。值会从这个位置读取，也会写入到这个位置。数据属性有 4 个特性描述它们的行为。

- `[[Configurable]]`：表示属性是否可以通过 `delete` 删除并重新定义，是否可以修改它的特性，以及是否可以把它改为访问器属性。默认情况下，所有直接定义在对象上的属性的这个特性都是 `true`
- `[[Enumerable]]`:表示属性是否可以通过 `for-in` 循环返回。默认情况下，所有直接定义在对象上的属性的这个特性都是 `true`
- `[[Writable]]`：表示属性的值是否可以被修改。默认情况下，所有直接定义在对象上的属性的
  这个特性都是 `true`
- `[[Value]]`：包含属性实际的值。这就是前面提到的那个读取和写入属性值的位置。这个特性
  的默认值为 `undefined`

## 访问器属性

访问器属性不包含数据值。相反，它们包含一个获取（`getter`）函数和一个设置（`setter`）函数，不过这两个函数不是必需的。在读取访问器属性时，会调用获取函数，这个函数的责任就是返回一个有效的值。在写入访问器属性时，会调用设置函数并传入新值，这个函数必须决定对数据做出什么修改。访问器属性有 4 个特性描述它们的行为。

- `[[Configurable]]`：表示属性是否可以通过 delete 删除并重新定义，是否可以修改它的特性，以及是否可以把它改为数据属性。默认情况下，所有直接义在对象上的属性的这个特性都是 true。
- `[[Enumerable]]`：表示属性是否可以通过 for-in 循环返回。默认情况下，所有直接定义在对
  象上的属性的这个特性都是 true。
- `[[Get]]`：获取函数，在读取属性时调用。默认值为 undefined。
- `[[Set]]`：设置函数，在写入属性时调用。默认值为 undefined。

访问器属性是不能直接定义的，必须使用 `Object.defineProperty()`

```js
let book = {
  year_: 2017,
  edition: 1
}
Object.defineProperty(book, 'year', {
  get() {
    return this.year_
  },
  set(newValue) {
    if (newValue > 2017) {
      this.year_ = newValue
      this.edition += newValue - 2017
    }
  }
})
book.year = 2018
console.log(book.edition) // 2
```

## 合并对象

`ECMAScript 6` 专门为合并对象提供了 `Object.assign()`方法。这个方法接收一个目标对象和一个或多个源对象作为参数，然后将每个源对象中可枚举（`Object.propertyIsEnumerable()`返回 `true`）和自有（`Object.hasOwnProperty()`返回 `true`）属性复制到目标对象。

## 增强的对象语法

### 属性值简写

简写属性名只要使用变量名（不用再写冒号）就会自动被解释为同名的属性键。

```js
let name = 'Matt'
let person = {
  name
}
console.log(person) // { name: 'Matt' }
```

### 可计算属性

有了可计算属性，就可以在对象字面量中完成动态属性赋值。中括号包围的对象属性键告诉运行时将其作为 `JavaScript` 表达式而不是字符串来求值：

```js
const nameKey = 'name'
const ageKey = 'age'
const jobKey = 'job'
let person = {
  [nameKey]: 'Matt',
  [ageKey]: 27,
  [jobKey]: 'Software engineer'
}
console.log(person) // { name: 'Matt', age: 27, job: 'Software engineer' }
```

### 简写方法名

新的简写方法的语法遵循同样的模式，但开发者要放弃给函数表达式命名（不过给作为方法的函数命名通常没什么用）。

```js
let person = {
  sayName(name) {
    console.log(`My name is ${name}`)
  }
}
```

简写方法名对获取函数和设置函数也是适用的：

```js
let person = {
  name_: '',
  get name() {
    return this.name_
  },
  set name(name) {
    this.name_ = name
  },
  sayName() {
    console.log(`My name is ${this.name_}`)
  }
}
person.name = 'Matt'
person.sayName() // My name is Matt
```

简写方法名与可计算属性键相互兼容：

```js
const methodKey = 'sayName'
let person = {
  [methodKey](name) {
    console.log(`My name is ${name}`)
  }
}
person.sayName('Matt') // My name is Matt
```

## 对象解构

ECMAScript 6 新增了对象解构语法，可以在一条语句中使用嵌套数据实现一个或多个赋值操作。

```js
// 不使用对象解构
let person = {
  name: 'Matt',
  age: 27
}
let personName = person.name,
  personAge = person.age
console.log(personName) // Matt
console.log(personAge) // 27
// 使用对象解构
let person = {
  name: 'Matt',
  age: 27
}
let { name: personName, age: personAge } = person
console.log(personName) // Matt
console.log(personAge) // 27
```

如果想让变量直接使用属性的名称，那么可以使用简写语法

```js
let person = {
  name: 'Matt',
  age: 27
}
let { name, job } = person
console.log(name) // Matt
console.log(job) // undefined
```
