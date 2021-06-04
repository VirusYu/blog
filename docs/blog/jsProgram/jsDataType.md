---
title: JavaScript高级程序设计 - 数据类型
date: 2021-03-31
tags:
  - JavaScript
categories:
  - JavaScript
publish: true
---

[[toc]]

## 数据类型

`ECMAScript`中有 6 种简单数据类型（也称为**原始类型**）：`Undefined`、`Null`、`Boolean`、`String`、`Number`、`Symbol`，还有一种复杂数据类型为`Object`，像 js 中的`Function`、'Array'等都是`Object`。`Object`是一种无序键值对的集合。因为在`ECMAScript`不能定义自己的数据类型，所有值都可以用上述 7 中之一来表示。

## typeof 操作符

因为`ECMAScript`中的类型系统是松散的，所以需要一种手段来确定任意变量的数据类型，`typeof`就是为此而生的。

对一个值使用`typeof`操作符会返回下列字符串之一：

- `undefined`表示值未定义
- `boolean`表示值为布尔值
- `string`表示值为字符串
- `number`表示值为数值
- `object`表示值为对象或`null`
- `function`表示值为函数
- `symbol`表示值为`symbol`(符号)

## Undefined 类型

`Undefined`类型只有一个值，就是`Undefined`，当使用`var`和`let`声明变量但没有初始化时，就相当于给变量赋值了`Undefined`。

## Null 类型

`Null`类型也只有一个值，即特殊值`null`，逻辑上讲`null`值表示一个空对象指针。这也是`typeof null`会返回`object`的原因之一，当然也算是历史遗留问题。

## Boolean 类型

`Boolean`类型是 js 中使用最频繁的类型之一，有两个字面值：`true`和`false`。这两个值不同于数值，因此`true`不等于 1，`false`不等于 0。
虽然布尔值只有两个，但是所有其他 js 类型的值，都有对应的布尔值的等价形式。可以使用特定的`Boolean()`转型函数。

| 数据类型  | 转化为 true           | 转化为 false |
| --------- | --------------------- | ------------ |
| Boolean   | true                  | false        |
| String    | 非空字符串            | ""(空字符串) |
| Number    | 非 0 数值（包括无穷） | 0、NaN       |
| Object    | 任意对象              | Null         |
| Undefined | 不存在                | undefined    |

以上转换非常重要，因为像 if 等语句，会自动执行其他类型到布尔值的转换。

## Number 类型

在 js 中，`number`类型使用**IEEE 754**格式表示整数和浮点数，不同的数值类型相应的也有不同的数值字面量格式。

最基本的数值字面量格式是十进制，直接写出来即可。整数也可以用八进制或者十六进制字面量表示。对于八进制字面量，第一个数字必须是 0，然后是相应的八进制数字。如果字面中包含的数字超出了应有的范围，就会忽略前面的 0，后边的数字会被当成十进制数。八进制字面量在严格模式下是无效的。(在 ES6 以后，白禁止通过前缀 0o 表示)

十六进制字面量，必须让真正的数值前缀 0x(区分大小写)，然后是十六进制数字（0~9 以及 A~F）。十六进制中的字母大小写均可。

使用八进制和十六进制格式创建的数值，在所有数学操作中都被视为十进制数值。

### 浮点值

要定义浮点值，数值中必须包含小数点，而且小数点后面必须只要有一个数字，虽然小数点前面不是必须有整数，但是推荐加上。

因为存储浮点值使用的内存空间是存储整数值的两倍，所有 js 总是想办法将值转换为整数。如：小数点后面没有数字的情况或者数值本身就是整数，只是小数点后面跟着 0（如 1.0），那他也会被转换为整数。

对于非常大或者非常小的数值，浮点数可以用科学技术法表示。科学技术法的格式要求是一个数值（整数或者浮点数）就跟一个大写或者小写的字母 e，再加上一个要乘的 10 的多少次幂，比如：

```js
let floatNum = 3.1415e7 // 等价于31415000
```

如果要表示非常小的数值也可以用科学技术法，例如`0.000 000 000 000 000 03`，可以表示为`3e-17`。默认情况下，js 会将小数点后至少含有 6 个 0 的浮点数装换为科学技术法。

浮点值的精确度最高可达 17 位小数，但在算数计算中远不如整数精确，例如`0.1+0.2=0.30000000000000004`。

### 值的范围

因为内存的限制，js 并不支持表示世界上的所有数值。js 可以表示的最小数值保存在`Number.MIN_VALUE`中，最大值保存在`Number.MAX_VALUE`中。如果某个计算得到的数值结果超过了 js 可以表示的范围，那么这个数值会自动转换为一个特殊的`Infinity`(无穷)值。任何无法表示的负数以`-Infinity`(负无穷大)，任何无法表示的正数以`Infinity`表示。

如果计算返回`Infinity`或者`-Infinity`则该值不能在进一步用于任何计算。

要确定一个值是不是有限大，可以通过`isFinite()`函数来判断。

> 使用`Number.NEGATIVE_INFINITY`和`Number.POSITIVE_INFINITY`也可以获取负无穷和正无穷，这两个属性包含的值就是`-Infinity`h 和`Infinity`。

### NaN

有一个特殊的数值叫 `NaN`，意思是“不是数值”（Not a Number），用于表示本来要返回数值的操作失败了（而不是抛出错误）。比如，用 `0` 除任意数值在其他语言中通常都会导致错误，从而中止代码执行。但在 ECMAScript 中，`0`、`+0` 或`-0` 相除会返回 NaN。

任何涉及到`NaN`的操作结果都为`NaN`，`NaN`不等于包含`NaN`在内的任何值

```js
console.log(NaN == NaN) // false
console.log(0 / 0) // NaN
console.log(-0 / +0) // NaN
```

`ECMAScript` 提供了 `isNaN()`函数。该函数接收一个参数，可以是任意数据类型，然后判断这个参数是否是`NaN`。

```js
console.log(isNaN(NaN)) // true
console.log(isNaN(10)) // false，10 是数值
console.log(isNaN('10')) // false，可以转换为数值 10
console.log(isNaN('blue')) // true，不可以转换为数值
console.log(isNaN(true)) // false，可以转换为数值 1
```

### 数值转换

有三个函数可以进行类型转换，`Number()`、`parseInt()`和`parseFloat()`。`Number()`是转型函数，可以用于任何数据类型，`parseInt()`和`parseFloat`主要用于将字符串转换为数值。对于同样的参数，这 3 个函数执行的操作也不同。

`Number()`函数，基于如下规则执行转换：

- `Boolean`类型，`true`转为 1，`false 转为 0
- 数值，直接返回。
- `null`返回 0
- `Undefined`返回`NaN`
- 字符串按照以下规则
- - 如果字符串包含数值字符，包括数值字符前面带加、减号的情况，则转换为一个十进制数值。因此，Number("1")返回 1，Number("123")返回 123，Number("011")返回 11（忽略前面的零）。
- - 如果字符串包含有效的浮点值格式如"1.1"，则会转换为相应的浮点值（同样，忽略前面的零）
- - 如果字符串包含有效的十六进制格式如"0xf"，则会转换为与该十六进制值对应的十进制整数值
- - 如果是空字符串（不包含字符），则返回 0。
- - 如果字符串包含除上述情况之外的其他字符，则返回 NaN。
- 对象，调用`valueOf`方法，再按照上述规则转换返回的值。如果转换结果是 `NaN`，则调用`toString()`方法，再按照转换字符串的规则转换。

```js
let num1 = Number('Hello world!') // NaN
let num2 = Number('') // 0
let num3 = Number('000011') // 11
let num4 = Number(true) // 1
```

`parseInt()`函数更专注于字符串是否包含数值模式。字符串最前面的空格会被忽略，从第一个非空格字符开始转换。如果第一个字符不是数值字符、加号或减号，`parseInt()`立即返回 `NaN`。这意味着空字符串也会返回 `NaN`（这一点跟 `Number()`不一样，它返回 0）。如果第一个字符是数值字符、加号或减号，则继续依次检测每个字符，直到字符串末尾，或碰到非数值字符。比如，"1234blue"会被转换为 1234，因为"blue"会被完全忽略。类似地，"22.5"会被转换为 22，因为小数点不是有效的整数字符。

```js
let num1 = parseInt('1234blue') // 1234
let num2 = parseInt('') // NaN
let num3 = parseInt('0xA') // 10，解释为十六进制整数
let num4 = parseInt(22.5) // 22
let num5 = parseInt('70') // 70，解释为十进制值
let num6 = parseInt('0xf') // 15，解释为十六进制整数
```

假设字符串中的第一个字符是数值字符，`parseInt()`函数也能识别不同的整数格式（十进制、八进制、十六进制）。换句话说，如果字符串以"0x"开头，就会被解释为十六进制整数。如果字符串以"0"开头，且紧跟着数值字符，在非严格模式下会被某些实现解释为八进制整数。

不同的数值格式很容易混淆，因此 parseInt()也接收第二个参数，用于指定底数（进制数）。如果知道要解析的值是十六进制，那么可以传入 16 作为第二个参数，以便正确解析：

```js
let num = parseInt('0xAF', 16) // 175
```

事实上，如果提供了十六进制参数，那么字符串前面的"0x"可以省掉

`parseFloat()`函数的工作方式跟 `parseInt()`函数类似，着第一次出现的小数点是有效的，但第二次出现的小数点就无效了，此时字符串的剩余字符都会被忽略。因此，"22.34.5"将转换成 22.34。

`parseFloat()`函数的另一个不同之处在于，它始终忽略字符串开头的零。这个函数能识别前面讨论的所有浮点格式，以及十进制格式（开头的零始终被忽略）。十六进制数值始终会返回 0。因为`parseFloat()`只解析十进制值，因此不能指定底数。

```js
let num1 = parseFloat('1234blue') // 1234，按整数解析
let num2 = parseFloat('0xA') // 0
let num3 = parseFloat('22.5') // 22.5
let num4 = parseFloat('22.34.5') // 22.34
let num5 = parseFloat('0908.5') // 908.5
let num6 = parseFloat('3.125e7') // 31250000
```

## String 类型

`String`类型表示零或多个16位`Unicode`字符序列。字符串可以使用双引号(`"`)、单引号(`'`)或反引号(`)表示。

```js
let firstName = "二狗";
let lastName = '二狗';
let lastName = `二狗`
```

### 字符字面量

`String`数据类型中包含一些字符字面量，用于表示非打印字符或者有其他用途的字符。

| 字面量      | 含义 |
| ----------- | ----------- |
| \n      | 换行       |
| \t   | 制表        |
| \b   | 退格        |
| \r  | 回车        |
| \f  | 换页        |
| \\   | 反斜杠        |
| \'   | 单引号        |
| \"   | 双引号        |
| \`   | 反引号        |
| \xnn   |   以十六进制编码 nn 表示的字符（其中 n 是十六进制数字 0~F），例如\x41 等于"A"      |
| \t   | 以十六进制编码 nnnn 表示的 Unicode 字符（其中 n 是十六进制数字 0~F），例如\u03a3 等于希腊字
符"Σ"        |

### 字符串的特变

`ECMAScript`中的字符串是不可变的，一旦声明他们的值就不能变了，要修改某个变量中的字符串值，必须先销毁原始的字符串，然后将包含新值的另一个字符串保存到该变量。

### 转换为字符串

有两种凡是把一个值转换为字符串。

#### toString

首先是使用几乎所有值都有的`toString()`方法，这个方法唯一的用途是返回当前值的字符串等价物，如：

```js
let age = 11;
let ageAsString = age.toString(); // 字符串"11"
let found = true;
let foundAsString = found.toString(); // 字符串"true"
```

`toString`方法适用于数值、布尔值、对象和字符串，`null`和`undefind`没有`toString`方法。

### 模板字面量

模板字面量保留换行字符，可以跨行定义字符串：

```js
let myMultiLineString = 'first line\nsecond line';
let myMultiLineTemplateLiteral = `first line
second line`;
```

### 字符串插值

就是往字符串中插入一个或多个值，要注意的是模板字面量不是字符串，其实是一种特殊的`JavaScript`句法表达式，最后求值得到的是字符串。**模板字面量在定义时立即求值并转换为字符串实例，任何插入的变量也会从它们最接近的作
用域中取值。**

字符串插值通过在${}中使用一个 JavaScript 表达式实现：

```js
let value = 5;
let exponent = 'second';
// 以前，字符串插值是这样实现的：
let interpolatedString =
 value + ' to the ' + exponent + ' power is ' + (value * value);
// 现在，可以用模板字面量这样实现：
let interpolatedTemplateLiteral =
 `${ value } to the ${ exponent } power is ${ value * value }`;
console.log(interpolatedString); // 5 to the second power is 25
console.log(interpolatedTemplateLiteral); // 5 to the second power is 25 
```
所有插入的值都会使用 toString()强制转型为字符串，而且任何 JavaScript 表达式都可以用于插值。嵌套的模板字符串无须转义：

```js
console.log(`Hello, ${ `World` }!`); // Hello, World!
```

将表达式转换为字符串时会调用 `toString()`：
```js
let foo = { toString: () => 'World' };
console.log(`Hello, ${ foo }!`); // Hello, World! 
```