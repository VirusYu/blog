---
title: JavaScript高级程序设计 - 继承
date: 2021-07-07
tags:
  - JavaScript
categories:
  - JavaScript
publish: true
---

[[toc]]

# 继承

继承是面向对象编程中讨论最多的话题。很多面向对象语言都支持两种继承：接口继承和实现继承。前者只继承方法签名，后者继承实际的方法。接口继承在 `ECMAScript` 中是不可能的，因为函数没有签名(`TypeScript`中是有接口`interface`的)。实现继承是 `ECMAScript` 唯一支持的继承方式，而这主要是通过原型链实现的。

## 原型链

`ECMA-262` 把原型链定义为 `ECMAScript` 的主要继承方式。其基本思想就是通过原型继承多个引用类型的属性和方法。

每个构造函数都有一个原型对象，原型有一个属性`constructor`指回构造函数，实例有一个内部指针指向原型。如果原型是另一个类型的实例，就意味着这个原型本身有一个内部函数指针指向另一个原型，也就另一个原型也有一个指针指向另一个构造函数。这样就在实例和原型之间构造了一条原型链。

```js
function SuperType() {
  this.property = true
}

SuperType.prototype.getSuperValue = function() {
  return this.property
}

function SubType() {
  this.subProperty = false
}

SubType.prototype = new SuperType()

SubType.prototype.getSuperValue = function() {
  return this.subProperty
}

let instance = new SubType()

console.log(instance.getSuperValue())
```

以上代码定义了两个类型：`SuperType` 和 `SubType`。这两个类型分别定义了一个属性和一个方法。这两个类型的主要区别是 `SubType` 通过创建 `SuperType` 的实例并将其赋值给自己的原型 `SubType.prototype` 实现了对 `SuperType` 的继承。这个赋值重写了 `SubType` 最初的原型，将其替换为`SuperType` 的实例。这意味着 `SuperType` 实例可以访问的所有属性和方法也会存在于 `SubType.prototype`。这样实现继承之后，代码紧接着又给 `SubType.prototype`，也就是这个 `SuperType` 的实例添加了一个新方法。最后又创建了 `SubType` 的实例并调用了它继承的 `getSuperValue()`方法。

这个例子中实现继承的关键，是 `SubType` 没有使用默认原型，而是将其替换成了一个新的对象。这个新的对象恰好是 `SuperType` 的实例。这样一来，`SubType` 的实例不仅能从 `SuperType` 的实例中继承属性和方法，而且还与 `SuperType` 的原型挂上了钩。于是 `instance`（通过内部的`[[Prototype]]`）指向`SubType.prototype`，而 `SubType.prototype`（作为 `SuperType` 的实例又通过内部的`[[Prototype]]`）指向 `SuperType.prototype`。

在读取实例上的属性时，首先会在实例上搜索这个属性。如果没找到，则会继承搜索实例的原型。在通过原型链实现继承之后，搜索就可以继承向上，搜索原型的原型。对前面的例子而言，调用 `instance.getSuperValue()`经过了 3 步搜索：`instance`、`SubType.prototype` 和 `SuperType.prototype`，最后一步才找到这个方法。对属性和方法的搜索会一直持续到原型链的末端。

### 默认原型

实际上，原型链中还有一环。默认情况下，所有引用类型都继承自 `Object`，这也是通过原型链实现的。任何函数的默认原型都是一个 `Object` 的实例，这意味着这个实例有一个内部指针指向`Object.prototype`。这也是为什么自定义类型能够继承包括 `toString()`、`valueOf()`在内的所有默认方法的原因。

### 原型与继承关系

原型与实例的关系可以通过两种方式来确定。第一种方式是使用 `instanceof` 操作符，如果一个实例的原型链中出现过相应的构造函数，则 `instanceof` 返回 `true`。

```js
console.log(instance instanceof Object) // true
console.log(instance instanceof SuperType) // true
console.log(instance instanceof SubType) // true
```

确定这种关系的第二种方式是使用 `isPrototypeOf()`方法。原型链中的每个原型都可以调用这个方法，如下例所示，只要原型链中包含这个原型，这个方法就返回 `true`：

```js
console.log(Object.prototype.isPrototypeOf(instance)) // true
console.log(SuperType.prototype.isPrototypeOf(instance)) // true
console.log(SubType.prototype.isPrototypeOf(instance)) // true
```

### 关于方法

子类有时候需要覆盖父类的方法，或者增加父类没有的方法。为此，这些方法必须在原型赋值之后再添加到原型上。来看下面的例子：

```js
function SuperType() {
  this.property = true
}
SuperType.prototype.getSuperValue = function() {
  return this.property
}
function SubType() {
  this.subproperty = false
}
// 继承 SuperType
SubType.prototype = new SuperType()

// 新方法
SubType.prototype.getSubValue = function() {
  return this.subproperty
}
// 覆盖已有的方法
SubType.prototype.getSuperValue = function() {
  return false
}

let instance = new SubType()
console.log(instance.getSuperValue()) // false
```

第一个方法 `getSubValue()`是 `SubType` 的新方法，而第二个方法 `getSuperValue()`是原型链上已经存在但在这里被遮蔽的方法。后面在 `SubType` 实例上调用 `getSuperValue()`时调用的是这个方法。而 `SuperType` 的实例仍然会调用最初的方法。

> 以对象字面量方式创建原型方法会破坏之前的原型链，因为这相当于重写了原型链。

```js
function SuperType() {
  this.property = true
}
SuperType.prototype.getSuperValue = function() {
  return this.property
}
function SubType() {
  this.subproperty = false
}
// 继承 SuperType
SubType.prototype = new SuperType()
// 通过对象字面量添加新方法，这会导致上一行无效
SubType.prototype = {
  getSubValue() {
    return this.subproperty
  },
  someOtherMethod() {
    return false
  }
}
let instance = new SubType()
console.log(instance.getSuperValue()) // 出错！
```

子类的原型在被赋值为 `SuperType` 的实例后，又被一个对象字面量覆盖了。覆盖后的原型是一个 `Object` 的实例，而不再是 `SuperType` 的实例。因此之前的原型链就断了。`SubType`和 `SuperType` 之间也没有关系了。

### 原型链的问题

主要问题出现在原型中包含引用值的时候，原型中包含的引用值会在所有实例间共享，这也是为什么属性通常会在构造函数中定义而不会定义在原型上的原因。在使用原型实现继承时，原型实际上变成了另一个类型的实例。这意味着原先的实例属性摇身一变成为了原型属性。

```js
function SuperType() {
  this.colors = ['red', 'blue', 'green']
}
function SubType() {}
// 继承 SuperType
SubType.prototype = new SuperType()
let instance1 = new SubType()
instance1.colors.push('black')
console.log(instance1.colors) // "red,blue,green,black"
let instance2 = new SubType()
console.log(instance2.colors) // "red,blue,green,black"
```

原型链的第二个问题是，子类型在实例化时不能给父类型的构造函数传参。无法在不影响所有对象实例的情况下把参数传进父类的构造函数。

## 盗用构造函数

为了解决原型包含引用值导致的继承问题，一种叫作“盗用构造函数”（**constructor stealing**）的技术在开发社区流行起来（这种技术有时也称作“对象伪装”或“经典继承”）。

基本思路很简单：在子类构造函数中调用父类构造函数。因为毕竟函数就是在特定上下文中执行代码的简单对象，所以可以使用`apply()`和 `call()`方法以新创建的对象为上下文执行构造函数。

> 盗用构造函数可以访问实例的属性，但无法访问父类原型上的属性

```js
function SuperType() {
  this.colors = ['red', 'blue', 'green']
}
function SubType() {
  // 继承 SuperType
  SuperType.call(this)
}
let instance1 = new SubType()
instance1.colors.push('black')
console.log(instance1.colors) // "red,blue,green,black"
let instance2 = new SubType()
console.log(instance2.colors) // "red,blue,green"
```

### 传递参数

使用原型链，盗用构造函数的一个优点就是可以在子类构造函数中向父类构造函数传参。

```js
function SuperType(name) {
  this.name = name
}
function SubType() {
  // 继承 SuperType 并传参
  SuperType.call(this, 'Nicholas')
  // 实例属性
  this.age = 29
}
let instance = new SubType()
console.log(instance.name) // "Nicholas";
console.log(instance.age) // 29
```

### 盗用构造函数的问题

盗用构造函数的主要缺点，也是使用构造函数模式自定义类型的问题：必须在构造函数中定义方法，因此函数不能重用。此外，子类也不能访问父类原型上定义的方法，因此所有类型只能使用构造函数模式。由于存在这些问题，盗用构造函数基本上也不能单独使用。

## 组合继承

> 顾名思义，组合继承就是将原型链和盗用构造函数组合起来使用。

组合继承（有时候也叫伪经典继承）综合了原型链和盗用构造函数，将两者的优点集中了起来。基本的思路是使用原型链继承原型上的属性和方法，而通过盗用构造函数继承实例属性。这样既可以把方法定义在原型上以实现重用，又可以让每个实例都有自己的属性。

```js
function SuperType(name) {
  this.name = name
  this.colors = ['red', 'blue', 'green']
}
SuperType.prototype.sayName = function() {
  console.log(this.name)
}
function SubType(name, age) {
  // 继承属性
  SuperType.call(this, name)
  this.age = age
}
// 继承方法
SubType.prototype = new SuperType()
SubType.prototype.sayAge = function() {
  console.log(this.age)
}
let instance1 = new SubType('Nicholas', 29)
instance1.colors.push('black')
console.log(instance1.colors) // "red,blue,green,black"
instance1.sayName() // "Nicholas";
instance1.sayAge() // 29
let instance2 = new SubType('Greg', 27)
console.log(instance2.colors) // "red,blue,green"
instance2.sayName() // "Greg";
instance2.sayAge() // 27
```

在这个例子中，`SuperType` 构造函数定义了两个属性，`name` 和 `colors`，而它的原型上也定义了一个方法叫 `sayName()`。`SubType` 构造函数调用了 `SuperType` 构造函数，传入了 `name` 参数，然后又定义了自己的属性 `age`。此外，`SubType.prototype` 也被赋值为 `SuperType` 的实例。原型赋值之后，又在这个原型上添加了新方法 `sayAge()`。这样，就可以创建两个 `SubType` 实例，让这两个实例都有自己的属性，包括 `colors`，同时还共享相同的方法。

组合继承弥补了原型链和盗用构造函数的不足，是`JavaScript` 中使用最多的继承模式。而且组合继承也保留了 `instanceof` 操作符和 `isPrototypeOf()`方法识别合成对象的能力。

> 组合继承其实也存在效率问题。最主要的效率问题就是父类构造函数始终会被调用两次：一次在是创建子类原型时调用，另一次是在子类构造函数中调用。本质上，子类原型最终是要包含超类对象的所有实例属性，子类构造函数只要在执行时重写自己的原型就行了。

## 原型式继承

2006 年，Douglas Crockford 写了一篇文章：《JavaScript 中的原型式继承》（“Prototypal Inheritance inJavaScript”）。这篇文章介绍了一种不涉及严格意义上构造函数的继承方法。他的出发点是即使不自定义类型也可以通过原型实现对象之间的信息共享。文章最终给出了一个函数：

```js
function object(o) {
  function F() {}
  F.prototype = o
  return new F()
}
```

这个 `object()`函数会创建一个临时构造函数，将传入的对象赋值给这个构造函数的原型，然后返回这个临时类型的一个实例。

```js
let person = {
  name: 'Nicholas',
  friends: ['Shelby', 'Court', 'Van']
}
let anotherPerson = object(person)
anotherPerson.name = 'Greg'
anotherPerson.friends.push('Rob')
let yetAnotherPerson = object(person)
yetAnotherPerson.name = 'Linda'
yetAnotherPerson.friends.push('Barbie')
console.log(person.friends) // "Shelby,Court,Van,Rob,Barbie"
```

**Crockford** 推荐的原型式继承适用于这种情况：你有一个对象，想在它的基础上再创建一个新对象。你需要把这个对象先传给 `object()`，然后再对返回的对象进行适当修改。在这个例子中，`person` 对象定义了另一个对象也应该共享的信息，把它传给 `object()`之后会返回一个新对象。这个新对象的原型是 `person`，意味着它的原型上既有原始值属性又有引用值属性。这也意味着 `person.friends` 不仅是`person` 的属性，也会跟 `anotherPerson` 和`yetAnotherPerson` 共享。这里实际上克隆了两个 `person`。

ECMAScript 5 通过增加 Object.create()方法将原型式继承的概念规范化了。这个方法接收两个参数：作为新对象原型的对象，以及给新对象定义额外属性的对象（第二个可选）。在只有一个参数时，Object.create()与这里的 object()方法效果相同：

```js
let person = {
  name: 'Nicholas',
  friends: ['Shelby', 'Court', 'Van']
}
let anotherPerson = Object.create(person)
anotherPerson.name = 'Greg'
anotherPerson.friends.push('Rob')
let yetAnotherPerson = Object.create(person)
yetAnotherPerson.name = 'Linda'
yetAnotherPerson.friends.push('Barbie')
console.log(person.friends) // "Shelby,Court,Van,Rob,Barbie"
```

`Object.create()`的第二个参数与 `Object.defineProperties()`的第二个参数一样：每个新增属性都通过各自的描述符来描述。以这种方式添加的属性会遮蔽原型对象上的同名属性。

```js
let person = {
  name: 'Nicholas',
  friends: ['Shelby', 'Court', 'Van']
}
let anotherPerson = Object.create(person, {
  name: {
    value: 'Greg'
  }
})
console.log(anotherPerson.name) // "Greg"
```

> 原型式继承非常适合不需要单独创建构造函数，但仍然需要在对象间共享信息的场合。但要记住，属性中包含的引用值始终会在相关对象间共享，跟使用原型模式是一样的。

## 寄生式继承

与原型式继承比较接近的一种继承方式是寄生式继承。寄生式继承背后的思路类似于寄生构造函数和工厂模式：创建一个实现继承的函数，以某种方式增强对象，然后返回这个对象。

```js
function createAnother(original) {
  let clone = object(original) // 通过调用函数创建一个新对象
  clone.sayHi = function() {
    // 以某种方式增强这个对象
    console.log('hi')
  }
  return clone // 返回这个对象
}
```

在这段代码中，`createAnother()`函数接收一个参数，就是新对象的基准对象。这个对象 `original`会被传给 `object()`函数，然后将返回的新对象赋值给 `clone`。接着给 `clone`对象添加一个新方法`sayHi()`。最后返回这个对象。可以像下面这样使用 `createAnother()`函数:

```js
let person = {
  name: 'Nicholas',
  friends: ['Shelby', 'Court', 'Van']
}
let anotherPerson = createAnother(person)
anotherPerson.sayHi() // "hi"
```

这个例子基于 `person` 对象返回了一个新对象。新返回的 `anotherPerson` 对象具有 `person` 的所有属性和方法，还有一个新方法叫 `sayHi()`。寄生式继承同样适合主要关注对象，而不在乎类型和构造函数的场景。`object()`函数不是寄生式继承所必需的，任何返回新对象的函数都可以在这里使用。

> 通过寄生式继承给对象添加函数会导致函数难以重用，与构造函数模式类似.

## 寄生组合继承

组合继承其实也存在效率问题。最主要的效率问题就是父类构造函数始终会被调用两次：一次在是创建子类原型时调用，另一次是在子类构造函数中调用。本质上，子类原型最终是要包含超类对象的所有实例属性，子类构造函数只要在执行时重写自己的原型就行了。再来看一看这个组合继承的例子：

```js
function SuperType(name) {
  this.name = name
  this.colors = ['red', 'blue', 'green']
}
SuperType.prototype.sayName = function() {
  console.log(this.name)
}
function SubType(name, age) {
  SuperType.call(this, name) // 第二次调用 SuperType()
  this.age = age
}
SubType.prototype = new SuperType() // 第一次调用 SuperType()
SubType.prototype.constructor = SubType
SubType.prototype.sayAge = function() {
  console.log(this.age)
}
```

寄生式组合继承通过盗用构造函数继承属性，但使用混合式原型链继承方法。基本思路是不通过调用父类构造函数给子类原型赋值，而是取得父类原型的一个副本。说到底就是使用寄生式继承来继承父类原型，然后将返回的新对象赋值给子类原型。寄生式组合继承的基本模式如下所示：

```js
function inheritPrototype(subType, superType) {
  let prototype = object(superType.prototype) // 创建对象
  prototype.constructor = subType // 增强对象
  subType.prototype = prototype // 赋值对象
}
```

这个 inheritPrototype()函数实现了寄生式组合继承的核心逻辑。这个函数接收两个参数：子类构造函数和父类构造函数。在这个函数内部，第一步是创建父类原型的一个副本。然后，给返回的 prototype 对象设置 constructor 属性，解决由于重写原型导致默认 constructor 丢失的问题。最后将新创建的对象赋值给子类型的原型。如下例所示，调用 inheritPrototype()就可以实现前面例子中的子类型原型赋值：

```js
function SuperType(name) {
  this.name = name
  this.colors = ['red', 'blue', 'green']
}
SuperType.prototype.sayName = function() {
  console.log(this.name)
}
function SubType(name, age) {
  SuperType.call(this, name)
  this.age = age
}
inheritPrototype(SubType, SuperType)
SubType.prototype.sayAge = function() {
  console.log(this.age)
}
```

这里只调用了一次 `SuperType` 构造函数，避免了 `SubType.prototype` 上不必要也用不到的属性，因此可以说这个例子的效率更高。而且，原型链仍然保持不变，因此 `instanceof` 操作符和`isPrototypeOf()`方法正常有效。寄生式组合继承可以算是引用类型继承的最佳模式。