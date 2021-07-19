---
title: JavaScript高级程序设计 - 函数
date: 2021-07-16 20:32
tags:
  - JavaScript
categories:
  - JavaScript
publish: true
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

ECMAScript 函数的参数跟大多数其他语言不同。ECMAScript 函数既不关心传入的参数个数，也不关心这些参数的数据类型。定义函数时要接收两个参数，并不意味着调用时就传两个参数。你可以传一个、三个，甚至一个也不传，解释器都不会报错。

之所以会这样，主要是因为 `ECMAScript` 函数的参数在内部表现为一个数组。函数被调用时总会接收一个数组，但函数并不关心这个数组中包含什么。如果数组中什么也没有，那没问题；如果数组的元素超出了要求，那也没问题。事实上，在使用 `function` 关键字定义（非箭头）函数时，可以在函数内部访问 `arguments` 对象，从中取得传进来的每个参数值。

`arguments` 对象是一个类数组对象（但不是 `Array` 的实例），因此可以使用中括号语法访问其中的元素（第一个参数是 `arguments[0]`，第二个参数是 `arguments[1]`）。而要确定传进来多少个参数，可以访问 `arguments.length` 属性。

在下面的例子中，sayHi()函数的第一个参数叫 name：

```js
function sayHi(name, message) {
  console.log('Hello ' + name + ', ' + message)
}
// 可以通过 arguments[0]取得相同的参数值。因此，把函数重写成不声明参数也可以：
function sayHi() {
  console.log('Hello ' + arguments[0] + ', ' + arguments[1])
}
```

arguments 对象的另一个有意思的地方就是，它的值始终会与对应的命名参数同步。来看下面的例子：

```js
function doAdd(num1, num2) {
  arguments[1] = 10
  console.log(arguments[0] + num2)
}
```

这个 `doAdd()`函数把第二个参数的值重写为 10。因为 `arguments` 对象的值会自动同步到对应的命名参数，所以修改 `arguments[1]`也会修改 `num2` 的值，因此两者的值都是 10。但这并不意味着它们都访问同一个内存地址，它们在内存中还是分开的，只不过会保持同步而已。另外还要记住一点：如果只传了一个参数，然后把 `arguments[1]`设置为某个值，那么这个值并不会反映到第二个命名参数。这是因为 `arguments` 对象的长度是根据传入的参数个数，而非定义函数时给出的命名参数个数确定的。

对于命名参数而言，如果调用函数时没有传这个参数，那么它的值就是 `undefined`。这就类似于定义了变量而没有初始化。

严格模式下，`arguments` 会有一些变化。首先，像前面那样给 `arguments[1]`赋值不会再影响 `num2`的值。就算把 `arguments[1]`设置为 `10`，`num2` 的值仍然还是传入的值。其次，在函数中尝试重写`arguments` 对象会导致语法错误。（代码也不会执行。）

### 箭头函数中的参数

如果函数是使用箭头语法定义的，那么传给函数的参数将不能使用 `arguments` 关键字访问，而只能通过定义的命名参数访问。

```js
function foo() {
  console.log(arguments[0])
}
foo(5) // 5
let bar = () => {
  console.log(arguments[0])
}
bar(5) // ReferenceError: arguments is not defined
```

## 没有重载

ECMAScript 函数不能像传统编程那样重载。在其他语言比如 Java 中，一个函数可以有两个定义，只要签名（接收参数的类型和数量）不同就行。如前所述，ECMAScript 函数没有签名，因为参数是由、包含零个或多个值的数组表示的。没有函数签名，自然也就没有重载。如果在 ECMAScript 中定义了两个同名函数，则后定义的会覆盖先定义的。

```js
function addSomeNumber(num) {
  return num + 100
}
function addSomeNumber(num) {
  return num + 200
}
let result = addSomeNumber(100) // 300
```

把函数名当成指针也有助于理解为什么 ECMAScript 没有函数重载。在前面的例子中，定义两个同名的函数显然会导致后定义的重写先定义的。而那个例子几乎跟下面这个是一样的：

```js
let addSomeNumber = function(num) {
  return num + 100
}
addSomeNumber = function(num) {
  return num + 200
}
let result = addSomeNumber(100) // 300
```

## 默认参数值

ECMAScript5.1 及以前，实现默认参数的一种常用方式就是检测某个参数是否等于 undefined，如果是则意味着没有传这个参数，那就给它赋一个值：

```js
function makeKing(name) {
  name = typeof name !== 'undefined' ? name : 'Henry'
  return `King ${name} VIII`
}
console.log(makeKing()) // 'King Henry VIII'
console.log(makeKing('Louis')) // 'King Louis VIII'
```

ECMAScript 6 之后就不用这么麻烦了，因为它支持显式定义默认参数了。下面就是与前面代码等价的 ES6 写法，只要在函数定义中的参数后面用=就可以为参数赋一个默认值：

```js
function makeKing(name = 'Henry') {
  return `King ${name} VIII`
}
console.log(makeKing('Louis')) // 'King Louis VIII'
console.log(makeKing()) // 'King Henry VIII'
```

在使用默认参数时，`arguments` 对象的值不反映参数的默认值，只反映传给函数的参数。当然，跟 ES5 严格模式一样，修改命名参数也不会影响 `arguments` 对象，它始终以调用函数时传入的值为准：

```js
function makeKing(name = 'Henry') {
  name = 'Louis'
  return `King ${arguments[0]}`
}
console.log(makeKing()) // 'King undefined'
console.log(makeKing('Louis')) // 'King Louis'
```

默认参数值并不限于原始值或对象类型，也可以使用调用函数返回的值：

```js
let romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI']
let ordinality = 0
function getNumerals() {
  // 每次调用后递增
  return romanNumerals[ordinality++]
}
function makeKing(name = 'Henry', numerals = getNumerals()) {
  return `King ${name} ${numerals}`
}
console.log(makeKing())
console.log(makeKing('Louis', 'XVI')) // 'King Louis XVI'
console.log(makeKing()) // 'King Henry II'
console.log(makeKing()) // 'King Henry III' // 'King Henry I'
```

### 默认参数作用域与暂时性死区

因为在求值默认参数时可以定义对象，也可以动态调用函数，所以函数参数肯定是在某个作用域中求值的。

给多个参数定义默认值实际上跟使用 let 关键字顺序声明变量一样。来看下面的例子：

```js
function makeKing(name = 'Henry', numerals = 'VIII') {
  return `King ${name} ${numerals}`
}
console.log(makeKing()) // King Henry VIII
```

参数初始化顺序遵循“暂时性死区”规则，即前面定义的参数不能引用后面定义的。像这样就会抛出错误：

```js
// 调用时不传第一个参数会报错
function makeKing(name = numerals, numerals = 'VIII') {
  return `King ${name} ${numerals}`
}
```

参数也存在于自己的作用域中，它们不能引用函数体的作用域：

```js
// 调用时不传第二个参数会报错
function makeKing(name = 'Henry', numerals = defaultNumeral) {
  let defaultNumeral = 'VIII'
  return `King ${name} ${numerals}`
}
```

## 参数拓展与收集

ECMAScript 6 新增了扩展操作符，使用它可以非常简洁地操作和组合集合数据。扩展操作符最有用的场景就是函数定义中的参数列表，在这里它可以充分利用这门语言的弱类型及参数长度可变的特点。扩展操作符既可以用于调用函数时传参，也可以用于定义函数参数。

### 拓展参数

在给函数传参时，有时候可能不需要传一个数组，而是要分别传入数组的元素。

假设有如下函数定义，它会将所有传入的参数累加起来：

```js
let values = [1, 2, 3, 4]
function getSum() {
  let sum = 0
  for (let i = 0; i < arguments.length; ++i) {
    sum += arguments[i]
  }
  return sum
}
```

这个函数希望将所有加数逐个传进来，然后通过迭代 arguments 对象来实现累加。如果不使用扩展操作符，想把定义在这个函数这面的数组拆分，那么就得求助于 apply()方法：

```js
console.log(getSum.apply(null, values)) // 10
```

但在 ECMAScript 6 中，可以通过扩展操作符极为简洁地实现这种操作。对可迭代对象应用扩展操作符，并将其作为一个参数传入，可以将可迭代对象拆分，并将迭代返回的每个值单独传入。

```js
console.log(getSum(...values)) // 10
```

因为数组的长度已知，所以在使用扩展操作符传参的时候，并不妨碍在其前面或后面再传其他的值，包括使用扩展操作符传其他参数：

```js
console.log(getSum(-1, ...values)) // 9
console.log(getSum(...values, 5)) // 15
console.log(getSum(-1, ...values, 5)) // 14
console.log(getSum(...values, ...[5, 6, 7])) // 28
```

### 收集参数

在构思函数定义时，可以使用扩展操作符把不同长度的独立参数组合为一个数组。这有点类似 arguments 对象的构造机制，只不过收集参数的结果会得到一个 Array 实例。

```js
function getSum(...values) {
  // 顺序累加 values 中的所有值
  // 初始值的总和为 0
  return values.reduce((x, y) => x + y, 0)
}
console.log(getSum(1, 2, 3)) // 6
```

收集参数的前面如果还有命名参数，则只会收集其余的参数；如果没有则会得到空数组。因为收集参数的结果可变，所以只能把它作为最后一个参数：

```js
// 不可以
function getProduct(...values, lastValue) {}
// 可以
function ignoreFirst(firstValue, ...values) {
 console.log(values);
}
ignoreFirst(); // []
ignoreFirst(1); // []
ignoreFirst(1,2); // [2]
ignoreFirst(1,2,3); // [2, 3]
```

箭头函数虽然不支持 `arguments` 对象，但支持收集参数的定义方式，因此也可以实现与使用 `arguments` 一样的逻辑：

```js
let getSum = (...values) => {
  return values.reduce((x, y) => x + y, 0)
}
console.log(getSum(1, 2, 3)) // 6
```

## 函数声明与函数表达式

JavaScript 引擎在任何代码执行之前，会先读取函数声明，并在执行上下文中生成函数定义。而函数表达式必须等到代码执行到它那一行，才会在执行上下文中生成函数定义。

函数声明会在任何代码执行之前先被读取并添加到执行上下文。这个过程叫作函数声明提升（function declaration hoisting）。在执行代码时，`JavaScript` 引擎会先执行一遍扫描，把发现的函数声明提升到源代码树的顶部。因此即使函数定义出现在调用它们的代码之后，引擎也会把函数声明提升到顶部。

```js
// 没问题
console.log(sum(10, 10))
function sum(num1, num2) {
  return num1 + num2
}
// 会出错
console.log(sum(10, 10))
let sum = function(num1, num2) {
  return num1 + num2
}
```

## 函数作为值

因为函数名在 ECMAScript 中就是变量，所以函数可以用在任何可以使用变量的地方。这意味着不仅可以把函数作为参数传给另一个函数，而且还可以在一个函数中返回另一个函数。

```js
function callSomeFunction(someFunction, someArgument) {
  return someFunction(someArgument)
}
```

这个函数接收两个参数。第一个参数应该是一个函数，第二个参数应该是要传给这个函数的值。任何函数都可以像下面这样作为参数传递：

```js
function add10(num) {
  return num + 10
}
let result1 = callSomeFunction(add10, 10)
console.log(result1) // 20
function getGreeting(name) {
  return 'Hello, ' + name
}
let result2 = callSomeFunction(getGreeting, 'Nicholas')
console.log(result2) // "Hello, Nicholas"
```

`callSomeFunction()`函数是通用的，第一个参数传入的是什么函数都可以，而且它始终返回调用作为第一个参数传入的函数的结果。要注意的是，如果是访问函数而不是调用函数，那就必须不带括号，所以传给 `callSomeFunction()`的必须是 `add10` 和 `getGreeting`，而不能是它们的执行结果。

## 函数内部参数

在 `ECMAScript 5` 中，函数内部存在两个特殊的对象：`arguments` 和 `this`。`ECMAScript 6` 又新增了 `new.target` 属性。

### arguments

`arguments` 对象前面讨论过多次了，它是一个类数组对象，包含调用函数时传入的所有参数。

这个对象只有以 `function` 关键字定义函数（相对于使用箭头语法创建函数）时才会有。虽然主要用于包含函数参数，但 `arguments` 对象其实还有一个 `callee` 属性，是一个指向 `arguments` 对象所在函数的指针。

来看下面这个经典的阶乘函数：

```js
function factorial(num) {
  if (num <= 1) {
    return 1
  } else {
    return num * factorial(num - 1)
  }
}
```

阶乘函数一般定义成递归调用的，就像上面这个例子一样。只要给函数一个名称，而且这个名称不会变，这样定义就没有问题。但是，这个函数要正确执行就必须保证函数名是 `factorial`，从而导致了紧密耦合。使用 `arguments.callee` 就可以让函数逻辑与函数名解耦：

```js
function factorial(num) {
  if (num <= 1) {
    return 1
  } else {
    return num * arguments.callee(num - 1)
  }
}
```

这个重写之后的 `factorial()`函数已经用 `arguments.callee` 代替了之前硬编码的 `factorial`。这意味着无论函数叫什么名称，都可以引用正确的函数。考虑下面的情况：

```js
let trueFactorial = factorial
factorial = function() {
  return 0
}
console.log(trueFactorial(5)) // 120
console.log(factorial(5)) // 0
```

这里，`trueFactorial` 变量被赋值为 `factorial`，实际上把同一个函数的指针又保存到了另一个位置。然后，`factorial` 函数又被重写为一个返回 0 的函数。如果像 `factorial()`最初的版本那样不使用 `arguments.callee`，那么像上面这样调用 ()就会返回 0。不过，通过将函数与名称解耦，`trueFactorial()`就可以正确计算阶乘，而 `factorial()`则只能返回 0。

### this

`this`在标准函数和箭头函数中有不同的行为。在标准函数中，`this` 引用的是把函数当成方法调用的上下文对象，这时候通常称其为 `this` 值（在网页的全局上下文中调用函数时，`this` 指向 `windows`）。来看下面的例子：

```js
window.color = 'red'
let o = {
  color: 'blue'
}
function sayColor() {
  console.log(this.color)
}
sayColor() // 'red'
o.sayColor = sayColor
o.sayColor() // 'blue'
```

定义在全局上下文中的函数 `sayColor()`引用了 `this` 对象。这个 `this` 到底引用哪个对象必须到函数被调用时才能确定。因此这个值在代码执行的过程中可能会变。如果在全局上下文中调用`sayColor()`，这结果会输出"red"，因为 `this` 指向 `window`，而 `this.color` 相当于 `window.color`。而在把 `sayColor()`赋值给 `o` 之后再调用 `o.sayColor()`，`this` 会指向 `o`，即 `this.color` 相当于`o.color`，所以会显示"blue"。

在箭头函数中，`this`引用的是定义箭头函数的上下文。下面的例子演示了这一点。在对`sayColor()`的两次调用中，`this` 引用的都是 `window` 对象，因为这个箭头函数是在 `window` 上下文中定义的：

```js
window.color = 'red'
let o = {
  color: 'blue'
}
let sayColor = () => console.log(this.color)
sayColor() // 'red'
o.sayColor = sayColor
o.sayColor() // 'red'
```

### caller

`caller`个属性引用的是调用当前函数的函数，或者如果是
在全局作用域中调用的则为 `null`。

```js
function outer() {
  inner()
}
function inner() {
  console.log(inner.caller)
}
outer()
```

以上代码会显示 `outer()`函数的源代码。这是因为 `ourter()`调用了 `inner()`，`inner.caller`指向 `outer()`。如果要降低耦合度，则可以通过 `arguments.callee.caller` 来引用同样的值：

```js
function outer() {
  inner()
}
function inner() {
  console.log(arguments.callee.caller)
}
outer()
```

### new.target

`ECMAScript` 中的函数始终可以作为构造函数实例化一个新对象，也可以作为普通函数被调用。`ECMAScript 6` 新增了检测函数是否使用 `new` 关键字调用的 `new.target` 属性。如果函数是正常调用的，则 `new.target` 的值是 `undefined`；如果是使用 `new` 关键字调用的，则 `new.target` 将引用被调用的构造函数。

```js
function King() {
  if (!new.target) {
    throw 'King must be instantiated using "new"'
  }
  console.log('King instantiated using "new"')
}
new King() // King instantiated using "new"
King() // Error: King must be instantiated using "new"
```

## 函数属性与方法
