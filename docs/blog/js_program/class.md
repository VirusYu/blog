---
title: JavaScript高级程序设计 - class
date: 2021-07-13
tags:
  - JavaScript
categories:
  - JavaScript
publish: true
---

[[toc]]

# 类 - Class

`ECMAScript 6` 新引入的 `class` 关键字具有正式定义类的能力。类（`class`）是`ECMAScript` 中新的基础性语法糖结构，因此刚开始接触时可能会不太习惯。虽然 `ECMAScript 6` 类表面上看起来可以支持正式的面向对象编程，但实际上它背后使用的仍然是原型和构造函数的概念。

## 定义

与函数类型相似，定义类也有两种主要方式：类声明和类表达式。这两种方式都使用 class 关键字加大括号：

```js
// 类声明
class Person {}
// 类表达式
const Animal = class {}
```

与函数表达式类似，类表达式在它们被求值前也不能引用。不过，与函数定义不同的是，虽然函数声明可以提升，但类定义不能：

```js
console.log(FunctionExpression) // undefined
var FunctionExpression = function() {}
console.log(FunctionExpression) // function() {}
console.log(FunctionDeclaration) // FunctionDeclaration() {}
function FunctionDeclaration() {}
console.log(FunctionDeclaration) // FunctionDeclaration() {}
console.log(ClassExpression) // undefined
var ClassExpression = class {}
console.log(ClassExpression) // class {}
console.log(ClassDeclaration) // ReferenceError: ClassDeclaration is not defined
class ClassDeclaration {}
console.log(ClassDeclaration) // class ClassDeclaration {}
```

另一个跟函数声明不同的地方是，函数受函数作用域限制，而类受块作用域限制：

```js
{
  function FunctionDeclaration() {}
  class ClassDeclaration {}
}
console.log(FunctionDeclaration) // FunctionDeclaration() {}
console.log(ClassDeclaration) // ReferenceError: ClassDeclaration is not defined
```

### 类的构成

类可以包含构造函数方法、实例方法、获取函数、设置函数和静态类方法，但这些都不是必需的。空的类定义照样有效。默认情况下，类定义中的代码都在严格模式下执行。与函数构造函数一样，多数编程风格都建议类名的首字母要大写，以区别于通过它创建的实例（比如，通过 `class Foo {}`创建实例 `foo`）：

```js
// 空类定义，有效
class Foo {}
// 有构造函数的类，有效
class Bar {
  constructor() {}
}
// 有获取函数的类，有效
class Baz {
  get myBaz() {}
}
// 有静态方法的类，有效
class Qux {
  static myQux() {}
}
```

类表达式的名称是可选的。在把类表达式赋值给变量后，可以通过 `name` 属性取得类表达式的名称字符串。但不能在类表达式作用域外部访问这个标识符。

```js
let Person = class PersonName {
  identify() {
    console.log(Person.name, PersonName.name)
  }
}
let p = new Person()
p.identify() // PersonName PersonName
console.log(Person.name) // PersonName
console.log(PersonName) // ReferenceError: PersonName is not defined
```

## 类构造函数

`constructor` 关键字用于在类定义块内部创建类的构造函数。方法名 `constructor` 会告诉解释器在使用 `new` 操作符创建类的新实例时，应该调用这个函数。构造函数的定义不是必需的，不定义构造函数相当于将构造函数定义为空函数。

### 实例化

使用 `new` 操作符实例化 `Person` 的操作等于使用 `new` 调用其构造函数。唯一可感知的不同之处就是，`JavaScript` 解释器知道使用 `new` 和类意味着应该使用 `constructor` 函数进行实例化。

使用 `new` 调用类的构造函数会执行如下操作。

- 在内存中创建一个对象
- 这个新对象内部的`[[Prototype]]`指针被赋值为构造函数的 `prototype` 属性。
- 构造函数内部的 `this` 被赋值为这个新对象（即 `this` 指向新对象）。
- 执行构造函数内部的代码（给新对象添加属性）。
- 如果构造函数返回非空对象，则返回该对象；否则，返回刚创建的新对象。

类实例化时传入的参数会用作构造函数的参数。如果不需要参数，则类名后面的括号也是可选的：

```js
class Person {
  constructor(name) {
    console.log(arguments.length)
    this.name = name || null
  }
}
let p1 = new Person() // 0
console.log(p1.name) // null
let p2 = new Person() // 0
console.log(p2.name) // null
let p3 = new Person('Jake') // 1
console.log(p3.name) // Jake
```

默认情况下，类构造函数会在执行之后返回 `this` 对象。构造函数返回的对象会被用作实例化的对象，如果没有什么引用新创建的 `this` 对象，那么这个对象会被销毁。不过，如果返回的不是 `this` 对象，而是其他对象，那么这个对象不会通过 `instanceof` 操作符检测出跟类有关联，因为这个对象的原型指针并没有被修改。

```js
class Person {
  constructor(override) {
    this.foo = 'foo'
    if (override) {
      return {
        bar: 'bar'
      }
    }
  }
}
let p1 = new Person(),
  p2 = new Person(true)
console.log(p1) // Person{ foo: 'foo' }
console.log(p1 instanceof Person) // true
console.log(p2) // { bar: 'bar' }
console.log(p2 instanceof Person) // false
```

类构造函数与构造函数的主要区别是，调用类构造函数必须使用 `new` 操作符。而普通构造函数如果不使用 `new` 调用，那么就会以全局的 `this`（通常是`window`）作为内部对象。调用类构造函数时如果忘了使用 `new` 则会抛出错误：

```js
function Person() {}
class Animal {}
// 把 window 作为 this 来构建实例
let p = Person()
let a = Animal()
// TypeError: class constructor Animal cannot be invoked without 'new'
```

类构造函数没有什么特殊之处，实例化之后，它会成为普通的实例方法（但作为类构造函数，仍然要使用 `new` 调用）。因此，实例化之后可以在实例上引用它：

```js
class Person {}
// 使用类创建一个新实例
let p1 = new Person()
p1.constructor()
// TypeError: Class constructor Person cannot be invoked without 'new'
// 使用对类构造函数的引用创建一个新实例
let p2 = new p1.constructor()
```

### 把类当成特殊函数

`ECMAScript` 中没有正式的类这个类型。从各方面来看，`ECMAScript` 类就是一种特殊函数。声明一个类之后，通过 `typeof` 操作符检测类标识符，表明它是一个函数：

```js
class Person {}
console.log(Person) // class Person {}
console.log(typeof Person) // function
```

类标识符有 `prototype` 属性，而这个原型也有一个 `constructor` 属性指向类自身：

```js
class Person {}
console.log(Person.prototype) // { constructor: f() }
console.log(Person === Person.prototype.constructor) // true
```

与普通构造函数一样，可以使用 `instanceof` 操作符检查构造函数原型是否存在于实例的原型链中：

```js
class Person {}
let p = new Person()
console.log(p instanceof Person) // true
```

如前所述，类本身具有与普通构造函数一样的行为。在类的上下文中，类本身在使用 `new` 调用时就会被当成构造函数。重点在于，类中定义的 `constructor` 方法不会被当成构造函数，在对它使用 `instanceof` 操作符时会返回 `false` 。但是，如果在创建实例时直接将类构造函数当成普通构造函数来使用，那么 `instanceof` 操作符的返回值会反转：

```js
class Person {}
let p1 = new Person()
console.log(p1.constructor === Person) // true
console.log(p1 instanceof Person) // true
console.log(p1 instanceof Person.constructor) // false
let p2 = new Person.constructor()
console.log(p2.constructor === Person) // false
console.log(p2 instanceof Person) // false
console.log(p2 instanceof Person.constructor) // true
```

类是 `JavaScript` 的一等公民，因此可以像其他对象或函数引用一样把类作为参数传递：

```js
// 类可以像函数一样在任何地方定义，比如在数组中
let classList = [
  class {
    constructor(id) {
      this.id_ = id
      console.log(`instance ${this.id_}`)
    }
  }
]
function createInstance(classDefinition, id) {
  return new classDefinition(id)
}
let foo = createInstance(classList[0], 3141) // instance 3141

// 因为是一个类表达式，所以类名是可选的
let p = new (class Foo {
  constructor(x) {
    console.log(x)
  }
})('bar') // bar
console.log(p) // Foo {}
```

## 实例、原型和类成员

类的语法可以非常方便地定义应该存在于实例上的成员、应该存在于原型上的成员，以及应该存在于类本身的成员。

### 实例成员

每次通过 `new` 调用类标识符时，都会执行类构造函数。在这个函数内部，可以为新创建的实例（`this`）添加“自有”属性。至于添加什么样的属性，则没有限制。另外，在构造函数执行完毕后，仍然可以给实例继续添加新成员。每个实例都对应一个唯一的成员对象，这意味着所有成员都不会在原型上共享：

```js
class Person {
  constructor() {
    // 这个例子先使用对象包装类型定义一个字符串
    // 为的是在下面测试两个对象的相等性
    this.name = new String('Jack')
    this.sayName = () => console.log(this.name)
    this.nicknames = ['Jake', 'J-Dog']
  }
}
let p1 = new Person(),
  p2 = new Person()
p1.sayName() // Jack
p2.sayName() // Jack
console.log(p1.name === p2.name) // false
console.log(p1.sayName === p2.sayName) // false
console.log(p1.nicknames === p2.nicknames) // false
p1.name = p1.nicknames[0]
p2.name = p2.nicknames[1]
p1.sayName() // Jake
p2.sayName() // J-Dog
```

### 原型方法与访问器

为了在实例间共享方法，类定义语法把在类块中定义的方法作为原型方法。

```js
class Person {
  constructor() {
    // 添加到 this 的所有内容都会存在于不同的实例上
    this.locate = () => console.log('instance')
  }
  // 在类块中定义的所有内容都会定义在类的原型上
  locate() {
    console.log('prototype')
  }
}
let p = new Person()
p.locate() // instance
Person.prototype.locate() // prototype
```

可以把方法定义在类构造函数中或者类块中，但不能在类块中给原型添加原始值或对象作为成员数据：

```js
class Person {
  name: 'Jake'
}
// Uncaught SyntaxError: Unexpected token
```

类方法等同于对象属性，因此可以使用字符串、符号或计算的值作为键：

```js
const symbolKey = Symbol('symbolKey')
class Person {
  stringKey() {
    console.log('invoked stringKey')
  }
  [symbolKey]() {
    console.log('invoked symbolKey')
  }
  ['computed' + 'Key']() {
    console.log('invoked computedKey')
  }
}
let p = new Person()
p.stringKey() // invoked stringKey
p[symbolKey]() // invoked symbolKey
p.computedKey() // invoked computedKey
```

类定义也支持获取和设置访问器。语法与行为跟普通对象一样：

```js
class Person {
  set name(newName) {
    this.name_ = newName
  }
  get name() {
    return this.name_
  }
}
let p = new Person()
p.name = 'Jake'
console.log(p.name) // Jake
```

### 静态类方法

可以在类上定义静态方法。这些方法通常用于执行不特定于实例的操作，也不要求存在类的实例。与原型成员类似，静态成员每个类上只能有一个。静态类成员在类定义中使用 `static` 关键字作为前缀。在静态成员中，`this` 引用类自身。其他所有约定跟原型成员一样：

```js
class Person {
  constructor() {
    // 添加到 this 的所有内容都会存在于不同的实例上
    this.locate = () => console.log('instance', this)
  }
  // 定义在类的原型对象上
  locate() {
    console.log('prototype', this)
  }
  // 定义在类本身上
  static locate() {
    console.log('class', this)
  }
}
let p = new Person()
p.locate() // instance, Person {}
Person.prototype.locate() // prototype, {constructor: ... }
Person.locate() // class, class Person {}
```

静态类方法非常适合作为实例工厂：

```js
class Person {
  constructor(age) {
    this.age_ = age
  }
  sayAge() {
    console.log(this.age_)
  }
  static create() {
    // 使用随机年龄创建并返回一个 Person 实例
    return new Person(Math.floor(Math.random() * 100))
  }
}
console.log(Person.create()) // Person { age_: ... }
```

### 非函数原型和类成员

虽然类定义并不显式支持在原型或类上添加成员数据，但在类定义外部，可以手动添加：

```js
class Person {
  sayName() {
    console.log(`${Person.greeting} ${this.name}`)
  }
}
// 在类上定义数据成员
Person.greeting = 'My name is'
// 在原型上定义数据成员
Person.prototype.name = 'Jake'
let p = new Person()
p.sayName() // My name is Jake
```

> 类定义中之所以没有显式支持添加数据成员，是因为在共享目标（原型和类）上添加可变（可修改）数据成员是一种反模式。一般来说，对象实例应该独自拥有通过 this 引用的数据。

### 迭代器与生成器方法

类定义语法支持在原型和类本身上定义生成器方法：

```js
class Person {
  // 在原型上定义生成器方法
  *createNicknameIterator() {
    yield 'Jack'
    yield 'Jake'
    yield 'J-Dog'
  }
  // 在类上定义生成器方法
  static *createJobIterator() {
    yield 'Butcher'
    yield 'Baker'
    yield 'Candlestick maker'
  }
}
let jobIter = Person.createJobIterator()
console.log(jobIter.next().value) // Butcher
console.log(jobIter.next().value) // Baker
console.log(jobIter.next().value) // Candlestick maker
let p = new Person()
let nicknameIter = p.createNicknameIterator()
console.log(nicknameIter.next().value) // Jack
console.log(nicknameIter.next().value) // Jake
console.log(nicknameIter.next().value) // J-Dog
```

因为支持生成器方法，所以可以通过添加一个默认的迭代器，把类实例变成可迭代对象：

```js
class Person {
  constructor() {
    this.nicknames = ['Jack', 'Jake', 'J-Dog']
  }
  *[Symbol.iterator]() {
    yield* this.nicknames.entries()
  }
}
let p = new Person()
for (let [idx, nickname] of p) {
  console.log(nickname)
}
// Jack
// Jake
// J-Dog
class Person {
  constructor() {
    this.nicknames = ['Jack', 'Jake', 'J-Dog']
  }
  [Symbol.iterator]() {
    return this.nicknames.entries()
  }
}
let p = new Person()
for (let [idx, nickname] of p) {
  console.log(nickname)
}
// Jack
// Jake
// J-Dog
```

## 继承

本章前面花了大量篇幅讨论如何使用 ES5 的机制实现继承。ECMAScript 6 新增特性中最出色的一个就是原生支持了类继承机制。虽然类继承使用的是新语法，但背后依旧使用的是原型链。

### 继承基础

`ES6` 类支持单继承。使用 `extends`关键字，就可以继承任何拥有`[[Construct]]`和原型的对象。很大程度上，这意味着不仅可以继承一个类，也可以继承普通的构造函数（保持向后兼容）：

```js
class Vehicle {}
// 继承类
class Bus extends Vehicle {}
let b = new Bus();
console.log(b instanceof Bus); // true
console.log(b instanceof Vehicle); // true
function Person() {}
// 继承普通构造函数
class Engineer extends Person {}
let e = new Engineer();
console.log(e instanceof Engineer); // true
console.log(e instanceof Person); // true
派生类都会通过原型链访问到类和原型上定义的方法。th
```

派生类都会通过原型链访问到类和原型上定义的方法。this 的值会反映调用相应方法的实例或者类：

```js
class Vehicle {
  identifyPrototype(id) {
    console.log(id, this)
  }
  static identifyClass(id) {
    console.log(id, this)
  }
}
class Bus extends Vehicle {}
let v = new Vehicle()
let b = new Bus()
b.identifyPrototype('bus') // bus, Bus {}
v.identifyPrototype('vehicle') // vehicle, Vehicle {}
Bus.identifyClass('bus') // bus, class Bus {}
Vehicle.identifyClass('vehicle') // vehicle, class Vehicle {}
```

> extends 关键字也可以在类表达式中使用，因此 `let Bar = class extends Foo {}`是有效的语法。

### 构造函数、`HomeObject` 和 `super()`

派生类的方法可以通过 `super` 关键字引用它们的原型。这个关键字只能在派生类中使用，而且仅、限于类构造函数、实例方法和静态方法内部。在类构造函数中使用 `super` 可以调用父类构造函数。

```js
class Vehicle {
  constructor() {
    this.hasEngine = true
  }
}
class Bus extends Vehicle {
  constructor() {
    // 不要在调用 super()之前引用 this，否则会抛出 ReferenceError
    super() // 相当于 super.constructor()
    console.log(this instanceof Vehicle) // true
    console.log(this) // Bus { hasEngine: true }
  }
}
new Bus()
```

在静态方法中可以通过 `super` 调用继承的类上定义的静态方法：

```js
class Vehicle {
  static identify() {
    console.log('vehicle')
  }
}
class Bus extends Vehicle {
  static identify() {
    super.identify()
  }
}
Bus.identify() // vehicle
```

> `ES6` 给类构造函数和静态方法添加了内部特性`[[HomeObject]]`，这个特性是一个指针，指向定义该方法的对象。这个指针是自动赋值的，而且只能在 `JavaScript` 引擎内部访问。`super` 始终会定义为`[[HomeObject]]`的原型。

在使用 super 时要注意几个问题:

- `super` 只能在派生类构造函数和静态方法中使用。

```js
class Vehicle {
  constructor() {
    super()
    // SyntaxError: 'super' keyword unexpected
  }
}
```

- 不能单独引用 `super` 关键字，要么用它调用构造函数，要么用它引用静态方法。

```js
class Vehicle {}
class Bus extends Vehicle {
  constructor() {
    console.log(super)
    // SyntaxError: 'super' keyword unexpected here
  }
}
```

- 调用 `super()`会调用父类构造函数，并将返回的实例赋值给 this。

```js
class Vehicle {}
class Bus extends Vehicle {
  constructor() {
    super()
    console.log(this instanceof Vehicle)
  }
}
new Bus() // true
```

- `super()`的行为如同调用构造函数，如果需要给父类构造函数传参，则需要手动传入

```js
class Vehicle {
  constructor(licensePlate) {
    this.licensePlate = licensePlate
  }
}
class Bus extends Vehicle {
  constructor(licensePlate) {
    super(licensePlate)
  }
}
console.log(new Bus('1337H4X')) // Bus { licensePlate: '1337H4X' }
```

- 如果没有定义类构造函数，在实例化派生类时会调用 `super()`，而且会传入所有传给派生类的参数。

```js
class Vehicle {
  constructor(licensePlate) {
    this.licensePlate = licensePlate
  }
}
class Bus extends Vehicle {}
console.log(new Bus('1337H4X')) // Bus { licensePlate: '1337H4X' }
```

- 在类构造函数中，不能在调用 `super()`之前引用 `this`。

```js
class Vehicle {}
class Bus extends Vehicle {
  constructor() {
    console.log(this)
  }
}
new Bus()
// ReferenceError: Must call super constructor in derived class
// before accessing 'this' or returning from derived constructor
```

- 如果在派生类中显式定义了构造函数，则要么必须在其中调用 `super()`，要么必须在其中返回一个对象。

```js
class Vehicle {}
class Car extends Vehicle {}
class Bus extends Vehicle {
  constructor() {
    super()
  }
}
class Van extends Vehicle {
  constructor() {
    return {}
  }
}
console.log(new Car()) // Car {}
console.log(new Bus()) // Bus {}
console.log(new Van()) // {}
```

### 抽象基类

有时候可能需要定义这样一个类，它可供其他类继承，但本身不会被实例化。虽然 `ECMAScript` 没有专门支持这种类的语法 ，但通过 `new.target` 也很容易实现。`new.target` 保存通过 `new` 关键字调用的类或函数。通过在实例化时检测 `new.target` 是不是抽象基类，可以阻止对抽象基类的实例化：

```js
// 抽象基类
class Vehicle {
  constructor() {
    console.log(new.target)
    if (new.target === Vehicle) {
      throw new Error('Vehicle cannot be directly instantiated')
    }
  }
}
// 派生类
class Bus extends Vehicle {}
new Bus() // class Bus {}
new Vehicle() // class Vehicle {}
// Error: Vehicle cannot be directly instantiated
```

另外，通过在抽象基类构造函数中进行检查，可以要求派生类必须定义某个方法。因为原型方法在调用类构造函数之前就已经存在了，所以可以通过 `this` 关键字来检查相应的方法：

```js
// 抽象基类
class Vehicle {
  constructor() {
    if (new.target === Vehicle) {
      throw new Error('Vehicle cannot be directly instantiated')
    }
    if (!this.foo) {
      throw new Error('Inheriting class must define foo()')
    }
    console.log('success!')
  }
}
// 派生类
class Bus extends Vehicle {
  foo() {}
}
// 派生类
class Van extends Vehicle {}
new Bus() // success!
new Van() // Error: Inheriting class must define foo()
```

### 继承内置类型

ES6 类为继承内置引用类型提供了顺畅的机制，开发者可以方便地扩展内置类型：

```js
class SuperArray extends Array {
  shuffle() {
    // 洗牌算法
    for (let i = this.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[this[i], this[j]] = [this[j], this[i]]
    }
  }
}
let a = new SuperArray(1, 2, 3, 4, 5)
console.log(a instanceof Array) // true
console.log(a instanceof SuperArray) // true
console.log(a) // [1, 2, 3, 4, 5]
a.shuffle()
console.log(a) // [3, 1, 4, 5, 2]
```

有些内置类型的方法会返回新实例。默认情况下，返回实例的类型与原始实例的类型是一致的：

```js
class SuperArray extends Array {}
let a1 = new SuperArray(1, 2, 3, 4, 5)
let a2 = a1.filter(x => !!(x % 2))
console.log(a1) // [1, 2, 3, 4, 5]
console.log(a2) // [1, 3, 5]
console.log(a1 instanceof SuperArray) // true
console.log(a2 instanceof SuperArray) // true
```

### 类混入

把不同类的行为集中到一个类是一种常见的 `JavaScript` 模式。虽然 `ES6` 没有显式支持多类继承，但通过现有特性可以轻松地模拟这种行为。

> `Object.assign()`方法是为了混入对象行为而设计的。只有在需要混入类的行为时才有必要自己实现混入表达式。如果只是需要混入多个对象的属性，那么使用`Object.assign()`就可以了。

在下面的代码片段中，`extends` 关键字后面是一个 `JavaScript` 表达式。任何可以解析为一个类或一
个构造函数的表达式都是有效的。这个表达式会在求值类定义时被求值:

```js
class Vehicle {}
function getParentClass() {
  console.log('evaluated expression')
  return Vehicle
}
class Bus extends getParentClass() {}
// 可求值的表达式
```

混入模式可以通过在一个表达式中连缀多个混入元素来实现，这个表达式最终会解析为一个可以被继承的类。如果 `Person` 类需要组合 A、B、C，则需要某种机制实现 B 继承 A，C 继承 B，而 `Person`再继承 C，从而把 A、B、C 组合到这个超类中。实现这种模式有不同的策略。一个策略是定义一组“可嵌套”的函数，每个函数分别接收一个超类作为参数，而将混入类定义为这个参数的子类，并返回这个类。这些组合函数可以连缀调用，最终组合成超类表达式：

```js
class Vehicle {}
let FooMixin = Superclass =>
  class extends Superclass {
    foo() {
      console.log('foo')
    }
  }
let BarMixin = Superclass =>
  class extends Superclass {
    bar() {
      console.log('bar')
    }
  }
let BazMixin = Superclass =>
  class extends Superclass {
    baz() {
      console.log('baz')
    }
  }
class Bus extends FooMixin(BarMixin(BazMixin(Vehicle))) {}
let b = new Bus()
b.foo() // foo
b.bar() // bar
b.baz() // baz

// 通过写一个辅助函数，可以把嵌套调用展开：
class Vehicle {}
let FooMixin = Superclass =>
  class extends Superclass {
    foo() {
      console.log('foo')
    }
  }
let BarMixin = Superclass =>
  class extends Superclass {
    bar() {
      console.log('bar')
    }
  }
let BazMixin = Superclass =>
  class extends Superclass {
    baz() {
      console.log('baz')
    }
  }
function mix(BaseClass, ...Mixins) {
  return Mixins.reduce((accumulator, current) => current(accumulator), BaseClass)
}
class Bus extends mix(Vehicle, FooMixin, BarMixin, BazMixin) {}
let b = new Bus()
b.foo() // foo
b.bar() // bar
b.baz() // baz
```

> 很多 `JavaScript` 框架（特别是 `React`）已经抛弃混入模式，转向了组合模式（把方法提取到独立的类和辅助对象中，然后把它们组合起来，但不使用继承）。这反映了那个众所周知的软件设计原则：“组合胜过继承（**composition over inheritance**）。”这个设计原则被很多人遵循，在代码设计中能提供极大的灵活性。
