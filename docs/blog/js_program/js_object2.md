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

`ECMAScript` 中的构造函数是用于创建特定类型对象的。像 `Object` 和 `Array` 这样的原生构造函数，运行时可以直接在执行环境中使用。当然也可以自定义构造函数，以函数的形式为自己的对象类型定义属性和方法。

```js
function Person(name, age, job) {
  this.name = name
  this.age = age
  this.job = job
  this.sayName = function() {
    console.log(this.name)
  }
}
let person1 = new Person('Nicholas', 29, 'Software Engineer')
let person2 = new Person('Greg', 27, 'Doctor')
person1.sayName() // Nicholas
person2.sayName() // Greg
```

`Person()`构造函数代替了 `createPerson()`工厂函数。实际上，`Person()`内部的代码跟 `createPerson()`基本是一样的，只是有如下区别。

- 没有显式地创建对象。
- 属性和方法直接赋值给了 this。
- 没有 return。

按照惯例，构造函数名称的首字母都是要大写的，非构造函数则以小写字母开头。这是从面向对象编程语言那里借鉴的，有助于在 `ECMAScript` 中区分构造函数和普通函数。毕竟 `ECMAScript` 的构造函数就是能创建对象的函数.

要创建 `Person` 的实例，应使用 `new` 操作符。以这种方式调用构造函数会执行如下操作。

- 在内存中创建一个新对象
- 这个新对象内部的`[[Prototype]]`特性被赋值为构造函数的 prototype 属性
- 构造函数内部的 `this` 被赋值为这个新对象（即 `this` 指向新对象）。
- 执行构造函数内部的代码（给新对象添加属性）。
- 如果构造函数返回非空对象，则返回该对象；否则，返回刚创建的新对象。

上一个例子的最后，`person1` 和 `person2` 分别保存着 `Person` 的不同实例。这两个对象都有一个`constructor` 属性指向 `Person`，如下所示：

```js
console.log(person1.constructor == Person) // true
console.log(person2.constructor == Person) // true
```

`constructor` 本来是用于标识对象类型的。不过，一般认为 `instanceof` 操作符是确定对象类型更可靠的方式。前面例子中的每个对象都是 `Object` 的实例，同时也是 `Person` 的实例，如下面调用`instanceof` 操作符的结果所示：

```js
console.log(person1 instanceof Object) // true
console.log(person1 instanceof Person) // true
console.log(person2 instanceof Object) // true
console.log(person2 instanceof Person) // true
```

定义自定义构造函数可以确保实例被标识为特定类型，相比于工厂模式，这是一个很大的好处。在这个例子中，`person1` 和 `person2` 之所以也被认为是 `Object` 的实例，是因为所有自定义对象都继承自 `Object`。

### 构造函数也是函数

构造函数与普通函数唯一的区别就是调用方式不同。除此之外，构造函数也是函数。并没有把某个函数定义为构造函数的特殊语法。任何函数只要使用 new 操作符调用就是构造函数，而不使用 new 操作符调用的函数就是普通函数。

```js
// 作为构造函数
let person = new Person('Nicholas', 29, 'Software Engineer')
person.sayName() // "Nicholas"
// 作为函数调用
Person('Greg', 27, 'Doctor') // 添加到 window 对象
window.sayName() // "Greg"
// 在另一个对象的作用域中调用
let o = new Object()
Person.call(o, 'Kristen', 25, 'Nurse')
o.sayName() // "Kristen"
```

候没有使用 `new` 操作符调用 `Person()`，结果会将属性和方法添加到 `window` 对象。这里要记住，在调用一个函数而没有明确设置 `this` 值的情况下（即没有作为对象的方法调用，或者没有使用 `call()/apply()`调用），`this` 始终指向 `Global` 对象（在浏览器中就是 `window` 对象）。

### 构造函数的问题

构造函数的主要问题在于，其定义的方法会在每个实例上都创建一遍。因此对前面的例子而言，`person1` 和 `person2` 都有名为 `sayName()`的方法，但这两个方法不是同一个 `Function` 实例。逻辑上讲，这个构造函数实际上是这样的：

```js
function Person(name, age, job) {
  this.name = name
  this.age = age
  this.job = job
  this.sayName = new Function('console.log(this.name)') // 逻辑等价
}
```

### 原型模式

每个函数都会创建一个 `prototype` 属性，这个属性是一个对象，包含应该由特定引用类型的实例共享的属性和方法。实际上，这个对象就是通过调用构造函数创建的对象的原型。使用原型对象的好处是，在它上面定义的属性和方法可以被对象实例共享。原来在构造函数中直接赋给对象实例的值，可以直接赋值给它们的原型，如下所示：

```js
function Person() {}
Person.prototype.name = 'Nicholas'
Person.prototype.age = 29
Person.prototype.job = 'Software Engineer'
Person.prototype.sayName = function() {
  console.log(this.name)
}
let person1 = new Person()
person1.sayName() // "Nicholas"
let person2 = new Person()
person2.sayName() // "Nicholas"
console.log(person1.sayName == person2.sayName) // true
```

#### 理解原型

只要创建一个函数，就会按照特定的规则为这个函数创建一个 `prototype` 属性（指向原型对象）。

所有原型对象自动获得一个名为 `constructor` 的属性，指回与之关联的构造函数。

对前面的例子而言，`Person.prototype.constructor` 指向 `Person`。然后，因构造函数而异，可能会给原型对象添加其他属性和方法。

在自定义构造函数时，原型对象默认只会获得 `constructor` 属性，其他的所有方法都继承自`Object`。每次调用构造函数创建一个新实例，这个实例的内部`[[Prototype]]`指针就会被赋值为构造函数的原型对象。脚本中没有访问这个`[[Prototype]]`特性的标准方式，但 `Firefox`、`Safari` 和 `Chrome`会在每个对象上暴露`__proto__`属性，通过这个属性可以访问对象的原型。

> 实例与构造函数原型之间有直接的联系，但实例与构造函数之间没有。

```js
/**
 * 构造函数可以是函数表达式
 * 也可以是函数声明，因此以下两种形式都可以：
 * function Person() {}
 * let Person = function() {}
 */
function Person() {}
/**
 * 声明之后，构造函数就有了一个
 * 与之关联的原型对象：
 */
console.log(typeof Person.prototype)
console.log(Person.prototype)
// {
// constructor: f Person(),
// __proto__: Object
// }
/**
 * 如前所述，构造函数有一个 prototype 属性
 * 引用其原型对象，而这个原型对象也有一个
 * constructor 属性，引用这个构造函数
 * 换句话说，两者循环引用：
 */
console.log(Person.prototype.constructor === Person) // true

/**
 * 正常的原型链都会终止于 Object 的原型对象
 * Object 原型的原型是 null
 */
console.log(Person.prototype.__proto__ === Object.prototype) // true
console.log(Person.prototype.__proto__.constructor === Object) // true
console.log(Person.prototype.__proto__.__proto__ === null) // true
console.log(Person.prototype.__proto__)
// {
// constructor: f Object(),
// toString: ...
// hasOwnProperty: ...
// isPrototypeOf: ...
// ...
// }
let person1 = new Person(),
  person2 = new Person()
/**
 * 构造函数、原型对象和实例
 * 是 3 个完全不同的对象：
 */
console.log(person1 !== Person) // true
console.log(person1 !== Person.prototype) // true
console.log(Person.prototype !== Person) // true
/**
 * 实例通过__proto__链接到原型对象，
 * 它实际上指向隐藏特性[[Prototype]]
 *
 * 构造函数通过 prototype 属性链接到原型对象
 *
 * 实例与构造函数没有直接联系，与原型对象有直接联系
 */
console.log(person1.__proto__ === Person.prototype) // true
conosle.log(person1.__proto__.constructor === Person) // true
/**
 * 同一个构造函数创建的两个实例
 * 共享同一个原型对象：
 */
console.log(person1.__proto__ === person2.__proto__) // true
/**
 * instanceof 检查实例的原型链中
 * 是否包含指定构造函数的原型：
 */
console.log(person1 instanceof Person) // true
console.log(person1 instanceof Object) // true
console.log(Person.prototype instanceof Object) // true
```

#### 原型层级

在通过对象访问属性时，会按照这个属性的名称开始搜索。搜索开始于对象实例本身。如果在这个实例上发现了给定的名称，则返回该名称对应的值。如果没有找到这个属性，则搜索会沿着指针进入原型对象，然后在原型对象上找到属性后，再返回对应的值。

虽然可以通过实例读取原型对象上的值，但不可能通过实例重写这些值。如果在实例上添加了一个与原型对象中同名的属性，那就会在实例上创建这个属性，这个属性会遮住原型对象上的属性。下面看一个例子：

```js
function Person() {}
Person.prototype.name = 'Nicholas'
Person.prototype.age = 29
Person.prototype.job = 'Software Engineer'
Person.prototype.sayName = function() {
  console.log(this.name)
}
let person1 = new Person()
let person2 = new Person()
person1.name = 'Greg'
console.log(person1.name) // "Greg"，来自实例
console.log(person2.name) // "Nicholas"，来自原型
```

只要给对象实例添加一个属性，这个属性就会遮蔽（shadow）原型对象上的同名属性，也就是虽然不会修改它，但会屏蔽对它的访问。即使在实例上把这个属性设置为 null，也不会恢复它和原型的联系。不过，使用 delete 操作符可以完全删除实例上的这个属性，从而让标识符解析过程能够继续搜索原型对象。

```js
function Person() {}
Person.prototype.name = 'Nicholas'
Person.prototype.age = 29
Person.prototype.job = 'Software Engineer'
Person.prototype.sayName = function() {
  console.log(this.name)
}
let person1 = new Person()
let person2 = new Person()
person1.name = 'Greg'
console.log(person1.name) // "Greg"，来自实例
console.log(person2.name) // "Nicholas"，来自原型
delete person1.name
console.log(person1.name) // "Nicholas"，来自原型
```

`hasOwnProperty()`方法用于确定某个属性是在实例上还是在原型对象上。这个方法是继承自 `Object`
的，会在属性存在于调用它的对象实例上时返回 `true`：

```js
function Person() {}
Person.prototype.name = 'Nicholas'
Person.prototype.age = 29
Person.prototype.job = 'Software Engineer'
Person.prototype.sayName = function() {
  console.log(this.name)
}
let person1 = new Person()
let person2 = new Person()
console.log(person1.hasOwnProperty('name')) // false
person1.name = 'Greg'
console.log(person1.name) // "Greg"，来自实例
console.log(person1.hasOwnProperty('name')) // true
console.log(person2.name) // "Nicholas"，来自原型
console.log(person2.hasOwnProperty('name')) // false
delete person1.name
console.log(person1.name) // "Nicholas"，来自原型
console.log(person1.hasOwnProperty('name')) // false
```

#### 原型和 in 操作符

有两种方式使用 `in` 操作符：单独使用和在 `for-in` 循环中使用。在单独使用时，`in` 操作符会在可以通过对象访问指定属性时返回 `true`，无论该属性是在实例上还是在原型上。

```js
function Person() {}
Person.prototype.name = 'Nicholas'
Person.prototype.age = 29
Person.prototype.job = 'Software Engineer'
Person.prototype.sayName = function() {
  console.log(this.name)
}
let person1 = new Person()
let person2 = new Person()
console.log(person1.hasOwnProperty('name')) // false
console.log('name' in person1) // true
person1.name = 'Greg'
console.log(person1.name) // "Greg"，来自实例
console.log(person1.hasOwnProperty('name')) // true
console.log('name' in person1) // true
console.log(person2.name) // "Nicholas"，来自原型
console.log(person2.hasOwnProperty('name')) // false
console.log('name' in person2) // true
delete person1.name
console.log(person1.name) // "Nicholas"，来自原型
console.log(person1.hasOwnProperty('name')) // false
console.log('name' in person1) // true
```

`for-in` 循环中使用 `in` 操作符时，可以通过对象访问且可以被枚举的属性都会返回，包括实例
属性和原型属性。遮蔽原型中不可枚举（`[[Enumerable]]`特性被设置为 `false`）属性的实例属性也会在 `for-in` 循环中返回，因为默认情况下开发者定义的属性都是可枚举的。

要获得对象上所有可枚举的实例属性，可以使用 `Object.keys()`方法。这个方法接收一个对象作为参数，返回包含该对象所有可枚举属性名称的字符串数组。

```js
function Person() {}
Person.prototype.name = 'Nicholas'
Person.prototype.age = 29
Person.prototype.job = 'Software Engineer'
Person.prototype.sayName = function() {
  console.log(this.name)
}
let keys = Object.keys(Person.prototype)
console.log(keys) // "name,age,job,sayName"
let p1 = new Person()
p1.name = 'Rob'
p1.age = 31
let p1keys = Object.keys(p1)
console.log(p1keys) // "[name,age]"
```

如果想列出所有实例属性，无论是否可以枚举，都可以使用 `Object.getOwnPropertyNames()`：

```js
let keys = Object.getOwnPropertyNames(Person.prototype)
console.log(keys) // "[constructor,name,age,job,sayName]"
```

在 `ECMAScript 6` 新增`Symbol`类型之后，相应地出现了增加一个 `Object.getOwnPropertyNames()`的兄弟方法的需求，因为以符号为键的属性没有名称的概念。因此，`Object.getOwnPropertySymbols()`方法就出现了，这个方法与 `Object.getOwnPropertyNames()`类似，只是针对`Symbol`而已：

```js
let k1 = Symbol('k1'),
  k2 = Symbol('k2')
let o = {
  [k1]: 'k1',
  [k2]: 'k2'
}
console.log(Object.getOwnPropertySymbols(o))
// [Symbol(k1), Symbol(k2)]
```

#### 属性枚举顺序

`for-in` 循环、`Object.keys()`、`Object.getOwnPropertyNames()`、`Object.getOwnPropertySymbols()`以及 `Object.assign()`在属性枚举顺序方面有很大区别。`for-in` 循环和 `Object.keys()`的枚举顺序是不确定的，取决于 `JavaScript` 引擎，可能因浏览器而异。

`Object.getOwnPropertyNames()`、`Object.getOwnPropertySymbols()`和 `Object.assign()`的枚举顺序是确定性的。先以升序枚举数值键，然后以插入顺序枚举字符串和符号键。在对象字面量中定义的键以它们逗号分隔的顺序插入。

## 对象迭代

`JavaScript` 有史以来的大部分时间内，迭代对象属性都是一个难题。`ECMAScript 2017` 新增了两个静态方法，用于将对象内容转换为序列化的——更重要的是可迭代的——格式。这两个静态方法 `Object.values()`和 `Object.entries()`接收一个对象，返回它们内容的数组。`Object.values()`返回对象值的数组，`Object.entries()`返回键/值对的数组。

```js
const o = {
  foo: 'bar',
  baz: 1,
  qux: {}
}
console.log(Object.values(o))
// ["bar", 1, {}]
console.log(Object.entries(o))
// [["foo", "bar"], ["baz", 1], ["qux", {}]]
```

注意，非字符串属性会被转换为字符串输出。另外，这两个方法执行对象的浅复制，`Symbol`属性会被忽略。

```js
const o = {
  qux: {}
}
console.log(Object.values(o)[0] === o.qux)
// true
console.log(Object.entries(o)[0][1] === o.qux)
// true

const sym = Symbol()
const o = {
  [sym]: 'foo'
}
console.log(Object.values(o))
// []
console.log(Object.entries(o))
// []
```

### 其他原型语法

在前面的例子中，每次定义一个属性或方法都会把 `Person.prototype` 重写一遍。为了减少代码冗余，也为了从视觉上更好地封装原型功能，直接通过一个包含所有属性和方法的对象字面量来重写原型成为了一种常见的做法。

```js
function Person() {}
Person.prototype = {
  name: 'Nicholas',
  age: 29,
  job: 'Software Engineer',
  sayName() {
    console.log(this.name)
  }
}
```

在这个例子中，`Person.prototype` 被设置为等于一个通过对象字面量创建的新对象。最终结果是一样的，只有一个问题：这样重写之后，`Person.prototype` 的 `constructor` 属性就不指向 `Person`了。在创建函数时，也会创建它的 `prototype` 对象，同时会自动给这个原型的 `constructor` 属性赋值。而上面的写法完全重写了默认的 `prototype` 对象，因此其 `constructor` 属性也指向了完全不同的新对象（`Object` 构造函数），不再指向原来的构造函数。

```js
let friend = new Person()
console.log(friend instanceof Object) // true
console.log(friend instanceof Person) // true
console.log(friend.constructor == Person) // false
console.log(friend.constructor == Object) // true
```

### 原型的动态性

因为从原型上搜索值的过程是动态的，所以即使实例在修改原型之前已经存在，任何时候对原型对
象所做的修改也会在实例上反映出来。

```js
let friend = new Person()
Person.prototype.sayHi = function() {
  console.log('hi')
}
friend.sayHi() // "hi"，没问题！
```

### 原生对象原型

原型模式之所以重要，不仅体现在自定义类型上，而且还因为它也是实现所有原生引用类型的模式。所有原生引用类型的构造函数（包括 `Object`、`Array`、`String` 等）都在原型上定义了实例方法。比如，数组实例的 `sort()`方法就是 `Array.prototype` 上定义的，而字符串包装对象的 `substring()`方法也是在 `String.prototype` 上定义的。

### 原型的问题

原型模式也不是没有问题。首先，它弱化了向构造函数传递初始化参数的能力，会导致所有实例默认都取得相同的属性值。虽然这会带来不便，但还不是原型的最大问题。原型的最主要问题源自它的共享特性。

我们知道，原型上的所有属性是在实例间共享的，这对函数来说比较合适。另外包含原始值的属性也还好，如前面例子中所示，可以通过在实例上添加同名属性来简单地遮蔽原型上的属性。真正的问题来自包含引用值的属性。来看下面的例子：

```js
function Person() {}
Person.prototype = {
  constructor: Person,
  name: 'Nicholas',
  age: 29,
  job: 'Software Engineer',
  friends: ['Shelby', 'Court'],
  sayName() {
    console.log(this.name)
  }
}
let person1 = new Person()
let person2 = new Person()
person1.friends.push('Van')
console.log(person1.friends) // "Shelby,Court,Van"
console.log(person2.friends) // "Shelby,Court,Van"
console.log(person1.friends === person2.friends) // true
```

这里，`Person.prototype` 有一个名为 `friends` 的属性，它包含一个字符串数组。然后这里创建了两个 `Person` 的实例。`person1.friends` 通过 `push` 方法向数组中添加了一个字符串。由于这个`friends` 属性存在于 `Person.prototype` 而非 `person1` 上，新加的这个字符串也会在（指向同一个数组的）`person2.friends` 上反映出来。如果这是有意在多个实例间共享数组，那没什么问题。但一般来说，不同的实例应该有属于自己的属性副本。这就是实际开发中通常不单独使用原型模式的原因。
