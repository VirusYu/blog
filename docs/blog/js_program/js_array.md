---
title: JavaScript高级程序设计 - Array
date: 2021-06-24
tags:
  - JavaScript
categories:
  - JavaScript
publish: true
---

[[toc]]

# Array

## 创建数组

### 通过构造函数创建数组

```js
let colors = new Array()
```

给构造函数传入一个数值，然后 length 属性就会被自动创建并设置为这个值。

```js
let colors = new Array(20)
```

也可以给 Array 构造函数传入要保存的元素：

```js
let colors = new Array('red', 'blue', 'green')
```

### 通过数组字面量创建

数组字面量是在中括号中包含以逗号分隔的元素列表：

```js
let colors = ['red', 'blue', 'green'] // 创建一个包含 3 个元素的数组
let names = [] // 创建一个空数组
let values = [1, 2] // 创建一个包含 2 个元素的数组
```

> 与对象一样，在使用数组字面量表示法创建数组不会调用 Array 构造函数。

`Array`构造函数还有两个 ES6 新增的用于创建数组的静态方法：`form`和`of`。`form`用于将类数组结构转换为数组实例，而`of`用于将一组参数转换为数组示例。

`Array.form()`的第一个参数是一个类数组对象，即任何可迭代的结构，或者有一个`length`属性和可索引元素的结构，这个方式可用于很多场合。

```js
// 字符串拆分
console.log(Array.from('Matt')) // ["M", "a", "t", "t"]
// 可以使用 from()将集合和映射转换为一个新数组
const m = new Map().set(1, 2).set(3, 4)
const s = new Set()
  .add(1)
  .add(2)
  .add(3)
  .add(4)
console.log(Array.from(m)) // [[1, 2], [3, 4]]
console.log(Array.from(s)) // [1, 2, 3, 4]

// Array.from()对现有数组执行浅拷贝
const a1 = [1, 2, 3, 4]
const a2 = Array.from(a1)
console.log(a1) // [1, 2, 3, 4]
alert(a1 === a2) // false

// 可以使用任何可迭代对象
const iter = {
  *[Symbol.iterator]() {
    yield 1
    yield 2
    yield 3
    yield 4
  }
}
console.log(Array.from(iter)) // [1, 2, 3, 4]

// arguments 对象可以被轻松地转换为数组
function getArgsArray() {
  return Array.from(arguments)
}
console.log(getArgsArray(1, 2, 3, 4)) // [1, 2, 3, 4]

// from()也能转换带有必要属性的自定义对象
const arrayLikeObject = {
  0: 1,
  1: 2,
  2: 3,
  3: 4,
  length: 4
}
console.log(Array.from(arrayLikeObject)) // [1, 2, 3, 4]
```

`Array.from()`还接收第二个可选的映射函数参数。这个函数可以直接增强新数组的值，而无须像
调用 `Array.from().map()`那样先创建一个中间数组。还可以接收第三个可选参数，用于指定映射函
数中 `this` 的值。但这个重写的 `this` 值在箭头函数中不适用。

```js
const a1 = [1, 2, 3, 4]
const a2 = Array.from(a1, x => x ** 2)
const a3 = Array.from(
  a1,
  function(x) {
    return x ** this.exponent
  },
  { exponent: 2 }
)
console.log(a2) // [1, 4, 9, 16]
console.log(a3) // [1, 4, 9, 16]
```

`Array.of()`可以把一组参数转换为数组。这个方法用于替代在 ES6 之前常用的 `Array.prototype.slice.call(arguments)`，一种异常笨拙的将 `arguments` 对象转换为数组的写法：

```js
console.log(Array.of(1, 2, 3, 4)) // [1, 2, 3, 4]
console.log(Array.of(undefined)) // [undefined]
```

## 数组空位

使用数组字面量初始化数组时，可以使用一串逗号来创建空位（`hole`）。

```js
const options = [, , , , ,] // 创建包含 5 个元素的数组
console.log(options.length) // 5
console.log(options) // [,,,,,]
```

ES6 新增的方法和迭代器与早期 ECMAScript 版本中存在的方法行为不同。ES6 新增方法普遍将这
些空位当成存在的元素，只不过值为 undefined：

```js
const options = [1, , , , 5]
for (const option of options) {
  console.log(option === undefined)
}
// false
// true
// true
// true
// false

const a = Array.from([, , ,]) // 使用 ES6 的 Array.from()创建的包含 3 个空位的数组
for (const val of a) {
  alert(val === undefined)
}
// true
// true
// true
alert(Array.of(...[, , ,])) // [undefined, undefined, undefined]
for (const [index, value] of options.entries()) {
  alert(value)
}
// 1
// undefined
// undefined
// undefined
// 5
```

ES6 之前的方法则会忽略这个空位，但具体的行为也会因方法而异：

```js
const options = [1, , , , 5]
// map()会跳过空位置
console.log(options.map(() => 6)) // [6, undefined, undefined, undefined, 6]
// join()视空位置为空字符串
console.log(options.join('-')) // "1----5"
```

## 数组索引

要取得或设置数组的值，需要使用中括号并提供相应值的数字索引，在中括号中提供的索引表示要访问的值。如果索引小于数组包含的元素数，则返回存储在相应位置的元素，如果把一个值设置给超过数组最大索引的索引，就像示例中的 colors[3]，则数组长度会自动扩展到该索引值加 1。

```js
let colors = ['red', 'blue', 'green'] // 定义一个字符串数组
alert(colors[0]) // 显示第一项
colors[2] = 'black' // 修改第三项
colors[3] = 'brown' // 添加第四项
```

## 检测数组

判断一个对象是不是数组，一般情况下可以通过`instanceof`操作符，ES 提供了`Array.isArray()`方法。这个方法的目的就是确定一个值是否为数组，而不用管它是在哪个全局执行上下文中创建的。

## 迭代器方法

在 ES6 中，`Array` 的原型上暴露了 3 个用于检索数组内容的方法：`keys()`、`values()`和`entries()`。`keys()`返回数组索引的迭代器，`values()`返回数组元素的迭代器，而 `entries()`返回索引/值对的迭代器：

```js
const a = ['foo', 'bar', 'baz', 'qux']
// 因为这些方法都返回迭代器，所以可以将它们的内容
// 通过 Array.from()直接转换为数组实例
const aKeys = Array.from(a.keys())
const aValues = Array.from(a.values())
const aEntries = Array.from(a.entries())
console.log(aKeys) // [0, 1, 2, 3]
console.log(aValues) // ["foo", "bar", "baz", "qux"]
console.log(aEntries) // [[0, "foo"], [1, "bar"], [2, "baz"], [3, "qux"]]
```

## 复制和填充

ES6 新增了两个方法：批量复制方法 `copyWithin()`，以及填充数组方法 `fill()`。这两个方法的函数签名类似，都需要指定既有数组实例上的一个范围，包含开始索引，不包含结束索引。使用这个方法不会改变数组的大小。

使用 `fill()`方法可以向一个已有的数组中插入全部或部分相同的值。开始索引用于指定开始填充的位置，它是可选的。如果不提供结束索引，则一直填充到数组末尾。负值索引从数组末尾开始计算。也可以将负索引想象成数组长度加上它得到的一个正索引：

```js
const zeroes = [0, 0, 0, 0, 0]
// 用 5 填充整个数组
zeroes.fill(5)
console.log(zeroes) // [5, 5, 5, 5, 5]
zeroes.fill(0) // 重置
// 用 6 填充索引大于等于 3 的元素
zeroes.fill(6, 3)
console.log(zeroes) // [0, 0, 0, 6, 6]
zeroes.fill(0) // 重置
// 用 7 填充索引大于等于 1 且小于 3 的元素
zeroes.fill(7, 1, 3)
console.log(zeroes) // [0, 7, 7, 0, 0];
zeroes.fill(0) // 重置
```

`copyWithin()`会按照指定范围浅复制数组中的部分内容，然后将它们插入到指定索引开始的位置。

```js
let ints,
  reset = () => (ints = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
reset()
// 从 ints 中复制索引 0 开始的内容，插入到索引 5 开始的位置
// 在源索引或目标索引到达数组边界时停止
ints.copyWithin(5)
console.log(ints) // [0, 1, 2, 3, 4, 0, 1, 2, 3, 4]
reset()
// 从 ints 中复制索引 5 开始的内容，插入到索引 0 开始的位置
ints.copyWithin(0, 5)
console.log(ints) // [5, 6, 7, 8, 9, 5, 6, 7, 8, 9]
```

## 转换方法

前面提到过，所有对象都有 `toLocaleString()`、`toString()`和 `valueOf()`方法。其中，`valueOf()`返回的还是数组本身。而 toString()返回由数组中每个值的等效字符串拼接而成的一个逗号分隔的字符串。

## 栈方法

`ECMAScript` 数组提供了 `push()`和 `pop()`方法，以实现类似栈的行为。

`push()`方法接收任意数量的参数，并将它们添加到数组末尾，返回数组的最新长度。

`pop()`方法则用于删除数组的最后一项，同时减少数组的 length 值，返回被删除的项。

## 队列方法

使用 `shift()`和 `push()`，可以把数组当成队列来使用。

`ECMAScript` 也为数组提供了 `unshift()`方法。顾名思义，`unshift()`就是执行跟 `shift()`相反的操作：在数组开头添加任意多个值，然后返回新的数组长度。

## 排序方法

数组有两个方法可以用来对元素重新排序：`reverse()`和 `sort()`。顾名思义，`reverse()`方法就是将数组元素反向排列。

`sort()`方法可以接收一个比较函数，比较函数接收两个参数，如果第一个参数应该排在第二个参数前面，就返回负值；如果两个参数相等，就返回 0；如果第一个参数应该排在第二个参数后面，就返回正值。下面是使用简单比较函数的一个例子：

```js
function compare(value1, value2) {
  if (value1 < value2) {
    return -1
  } else if (value1 > value2) {
    return 1
  } else {
    return 0
  }
}
```

## 操作方法

### concat

`concat()`方法会创建一个当前数组的副本，然后再把它的参数添加到副本末尾，最后返回这个新构建的数组。如果传入一个或多个数组，则 `concat()`会把这些数组的每一项都添加到结果数组。如果参数不是数组，则直接把它们添加到结果数组末尾。

```js
let colors = ['red', 'green', 'blue']
let colors2 = colors.concat('yellow', ['black', 'brown'])
console.log(colors) // ["red", "green","blue"]
console.log(colors2) // ["red", "green", "blue", "yellow", "black", "brown"]
```

### slice

`slice()`用于创建一个包含原有数组中一个或多个元素的新数组。`slice()`方法可以接收一个或两个参数：返回元素的开始索引和结束索引。如果只有一个参数，则 `slice()`会返回该索引到数组末尾的所有元素。如果有两个参数，则 `slice()`返回从开始索引到结束索引对应的所有元素，其中不包含结束索引对应的元素。这个操作不影响原始数组。

```js
let colors = ['red', 'green', 'blue', 'yellow', 'purple']
let colors2 = colors.slice(1)
let colors3 = colors.slice(1, 4)
alert(colors2) // green,blue,yellow,purple
alert(colors3) // green,blue,yellow
```

### splice

最强大的数组方法应该是`splice`了，splice()的主要目的是在数组中间插入元素，但有 3 种不同的方式使用这个方法。

- 删除，需要给 `splice()`传 2 个参数：要删除的第一个元素的位置和要删除的元素数量。
- 插入，需要给 `splice()`传 3 个参数：开始位置、0（要删除的元素数量）和要插入的元素，可以在数组中指定的位置插入元素。第三个参数之后还可以传第四个、第五个参数，乃至任意多个要插入的元素。
- 替换，`splice()`在删除元素的同时可以在指定位置插入新元素，同样要传入 3 个参数：开始位置、要删除元素的数量和要插入的任意多个元素。

`splice()`方法始终返回这样一个数组，它包含从数组中被删除的元素（如果没有删除元素，则返回空数组）。

```js
let colors = ['red', 'green', 'blue']
let removed = colors.splice(0, 1) // 删除第一项
alert(colors) // green,blue
alert(removed) // red，只有一个元素的数组
removed = colors.splice(1, 0, 'yellow', 'orange') // 在位置 1 插入两个元素
alert(colors) // green,yellow,orange,blue
alert(removed) // 空数组
removed = colors.splice(1, 1, 'red', 'purple') // 插入两个值，删除一个元素
alert(colors) // green,red,purple,orange,blue
alert(removed) // yellow，只有一个元素的数组
```

## 搜索和位置方法

`ECMAScript` 提供两类搜索数组的方法：按严格相等搜索和按断言函数搜索。

### 严格相等

`ECMAScript` 提供了 3 个严格相等的搜索方法：`indexOf()`、`lastIndexOf()`和 `includes()`。

这些方法都接收两个参数：要查找的元素和一个可选的起始搜索位置。`indexOf()`和 `includes()`方法从数组前头（第一项）开始向后搜索，而 `lastIndexOf()`从数组末尾（最后一项）开始向前搜索。

`indexOf()`和 `lastIndexOf()`都返回要查找的元素在数组中的位置，如果没找到则返回-1。`includes()`返回布尔值，表示是否至少找到一个与指定元素匹配的项。

```js
let numbers = [1, 2, 3, 4, 5, 4, 3, 2, 1]
alert(numbers.indexOf(4)) // 3
alert(numbers.lastIndexOf(4)) // 5
alert(numbers.includes(4)) // true
alert(numbers.indexOf(4, 4)) // 5
alert(numbers.lastIndexOf(4, 4)) // 3
alert(numbers.includes(4, 7)) // false
let person = { name: 'Nicholas' }
let people = [{ name: 'Nicholas' }]
let morePeople = [person]
alert(people.indexOf(person)) // -1
alert(morePeople.indexOf(person)) // 0
alert(people.includes(person)) // false
alert(morePeople.includes(person)) // true
```

### 断言函数

ECMAScript 也允许按照定义的断言函数搜索数组，每个索引都会调用这个函数。断言函数的返回值决定了相应索引的元素是否被认为匹配。断言函数接收 3 个参数：元素、索引和数组本身。其中元素是数组中当前搜索的元素，索引是当前元素的索引，而数组就是正在搜索的数组。断言函数返回真值，表示是否匹配。

`find()`和 `findIndex()`方法使用了断言函数。这两个方法都从数组的最小索引开始。`find()`返回第一个匹配的元素，`findIndex()`返回第一个匹配元素的索引。这两个方法也都接收第二个可选的参数，用于指定断言函数内部 `this` 的值。

## 迭代方法

ECMAScript 为数组定义了 5 个迭代方法。每个方法接收两个参数：以每一项为参数运行的函数，以及可选的作为函数运行上下文的作用域对象（影响函数中 this 的值）。传给每个方法的函数接收 3 个参数：数组元素、元素索引和数组本身。

- `every()`，：对数组每一项都运行传入的函数，如果对每一项函数都返回 true，则这个方法返回 true。
- `filter()`，对数组每一项都运行传入的函数，函数返回 true 的项会组成数组之后返回。
- `forEach()`，对数组每一项都运行传入的函数，没有返回值。
- `map()`，对数组每一项都运行传入的函数，返回由每次函数调用的结果构成的数组。
- `some()`，：对数组每一项都运行传入的函数，如果有一项函数返回 true，则这个方法返回 true。

这些方法都不改变调用它们的数组。

## 归并方法

`ECMAScript`中为数组定义了两个归并方法，`reduce()`和`reduceRight()`。这两个方法都会迭代数
组的所有项，并在此基础上构建一个最终返回值。`reduce()`方法从数组第一项开始遍历到最后一项。而 `reduceRight()`从最后一项开始遍历至第一项。

这两个方法都接受两个参数，每一项都会运行的归并函数，以及可选的以之为归并起点的初始值。传给 `reduce()`和 `reduceRight()`的函数接收 4 个参数：上一个归并值、当前项、当前项的索引和数组本身。
如果没有给这两个方法传入可选的第二个参数（作为归并起点值），则第一次迭代将从数组的第二项开始，因此传给归并函数的第一个参数是数组的第一项，第二个参数是数组的第二项。

## 定型数组

忽略