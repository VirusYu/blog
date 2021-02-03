---
title: 手写深拷贝与浅拷贝
date: 2021-01-27
tags:
 - JavaScript
 - 前端
categories:
 - 技术分享
 - JavaScript
publish: true
---
[[toc]]

# 深拷贝与浅拷贝
相信大家多少对浅拷贝与深拷贝有一定的了解，这里就不再多赘述，通过这篇文章，希望可以加深你对深拷贝的理解。

## 数据类型

如果聊到浅拷贝与深拷贝，那么肯定得聊到`js`的数据类型，最新的 `ECMAScript` 标准定义了 8 种数据类型，其中 7 中是基本数据类型，它们是：`Boolean`、`Null`、`Undefined`、`Number`、`tring`、`BigInt`、`Symbol`。其他的如：`Array`、`Function`、 `Reg`、`Data`等都算作`Object`，详可见 MDN文档 [JavaScript 数据类型和数据结构](https://developer.mozilla.org/zh-cn/docs/web/javascript/data_structures)

### 基本类型

基本数据类型都是存储在栈（stack）内存中，栈具有先进后出的特点，基本数据类型占用空间小、大小固定，通过按值来访问，属于被频繁使用的数据。

基础类型的引用和赋值，都是按值传递的，也就是赋值后两个变量互不影响。

### 引用类型

引用数据类型 `Object`，像 `Array`、`Function`、`Date`...等都属于 `Object`，它们的值都是对象。

引用数据类型存放在堆内存中，可以直接进行访问和修改。

引用类型的赋值，在栈中复制了一份引用类型的*地址指针*，两个变量指向的还是同一个对象，所以修改了obj2.name，obj.name也会发生改变，这种改变有时候并不是我们所期望的，这时候就需要拿出我们的秘技：浅拷贝和深拷贝。

```js
let obj = { name: 'test' };
let obj2 = obj;
obj2.name = '二狗';
console.log(obj.name); // 二狗
console.log(obj2.name); // 二狗
```
## 浅拷贝

浅拷贝就是将对象中的属性拷贝一份，如果属性是基础类型，直接复制该属性，如果属性是引用类型，则复制该属性对应的内存地址，下面介绍几种常用的浅拷贝方法。

### 拓展运算符 ...

现代化开发中最常用的浅拷贝就是*拓展运算符*`...`了，[mdn文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Spread_syntax)

```js
var arr = [1, 2, 3];
var arr2 = [...arr]; // like arr.slice()
arr2.push(4);
```

### Object.assign()

`Object.assign()` 方法用于将所有可枚举属性的值从一个或多个源对象分配到目标对象，它将返回目标对象。[mdn文档](https://developer.mozilla.org/zh-cn/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)

一般开发中会用来合并对象，如果有相同属性，则会以后面对象的值为准。

```js
const target = { a: 1, b: 2 };
const source = { b: 4, c: 5 };

const returnedTarget = Object.assign(target, source);

console.log(target);
// expected output: Object { a: 1, b: 4, c: 5 }

console.log(returnedTarget);
// expected output: Object { a: 1, b: 4, c: 5 }

```

### `concat`和`slice`

```js
let arr = [1, 2];
let arr2 = arr.concat();
arr.push(3);
console.log(arr); // [1, 2, 3]
console.log(arr2); // [1, 2]
```

```js
let arr = [1, 2];
let arr2 = arr.slice();
arr.push(3);
console.log(arr); // [1, 2, 3]
console.log(arr2); // [1, 2]

```
### 浅拷贝的问题

再进行浅拷贝时，对于引用类型，拷贝的是引用的内存地址，那如果拷贝之后，再去修改原对象的引用类型，在新对象中对应的值也会发生变化，这时候我们就需要用到深拷贝了。

```js
let obj = { name: '二狗', hobby: ['撸代码'] };
let obj2 = { ...obj };
obj2.name = '三狗';
console.log(obj.name); // 二狗
console.log(obj2.name); // 三狗

obj.hobby.push('打游戏');
console.log(obj.hobby); // ['撸代码', '打游戏']
console.log(obj2.hobby);// ['撸代码', '打游戏']
console.log(obj.hobby === obj2.hobby); // true

```

## 深拷贝

深拷贝，顾名思义就是比浅拷贝能够更深层级的拷贝，它能够将拷贝过程中遇到的引用类型都新开辟一块地址拷贝对应的数据，这样就能避免子对象共享同一份内存的问题了。

### JSON.stringify && JSON.parse 

基于`JSON.stringify`将对象先转成字符串，再通过`JSON.parse`将字符串转成对象，此时对象中每个层级的堆内存都是新开辟的。

```js
let obj = { name: '二狗', hobby: ['撸代码'] };
let obj2 = JSON.parse(JSON.stringify(obj));
obj2.name = '三狗';
console.log(obj.name); // 二狗
console.log(obj2.name); // 三狗

obj.hobby.push('打游戏');
console.log(obj.hobby); // ['撸代码', '打游戏']
console.log(obj2.hobby);// ['撸代码'']
```

这种方法虽然简单，但是也有不适用的场景：
 - 不能解决循环引用的问题
 - 无法拷贝特殊对象，比如：`RegExp`、`undefined`、`function`、`RegExp`、`Map`等

### 手写deepClone

既然使用`JSON.stringify && JSON.parse `无法满足所有场景的话，那我们就自己实现一个深拷贝。

实现深拷贝之前先思考下应该怎么如何实现，其实核心就是：浅拷贝 + 递归。

 - 对于基本数据类型，我们直接拷贝即可
 - 对于引用数据类型，则需要进行递归拷贝。

我们先实现一版最基础的`deepClone`，能够对对象和数组进行深拷贝

```js
function isObject(target) {
  const type = typeof target
  // 首先判断 target是不是null， 因为typeof null结果也为 object
  return type !== null && (type === 'object' || type === 'function')
}
function deepClone(target) {
  if (!isObject(target)) return target
  let cloneTarget = {}
  if (Array.isArray(target)) {
    cloneTarget = []
  }
  Object.keys(target).forEach((k) => {
    cloneTarget[k] = deepClone(target[k])
  })
  return cloneTarget
}
```

通过代码简单测试一下，可以发现已经实现基础的深拷贝了

```js
var obj = {
  name: 'test',
  age: '12',
  child: ['x', 'y'],
}
var obj1 = deepClone(obj)
obj.child.push('z')
console.log(obj.child) // ["x", "y", "z"]
console.log(obj1.child) // ["x", "y"]
```

### 使用 `weakSet` 处理循环引用

什么是循环引用？就是在对象内部引用对象本身，类似于递归

```js
let obj = { name: '二狗' };
obj.info = obj;
console.log(obj);
```

如果深拷贝没有对这种情况做处理的话，遇到循环引用就会导致内存溢出，程序卡死。

如何处理循环引用呢？我们可以`WeakSet`存储拷贝过的对象，当拷贝当前对象时，先去存储空间查找该对象是否被拷贝过，如果拷贝过，直接返回该对象，如果没有拷贝过就继续拷贝。

`WeakSet` 对象是一些对象值的集合, 并且其中的每个对象值都只能出现一次。

`WeakSet`持弱引用：集合中对象的引用为弱引用。 如果没有其他的对`WeakSet`中对象的引用，那么这些对象会被当成垃圾回收掉。 这也意味着`WeakSet`中没有存储当前对象的列表。 正因为这样，`WeakSet` 是不可枚举的。[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WeakSet)

```js
function deepClone(target, cache = new WeakSet()) {
  if (!isObject(target)) return target
  if (cache.has(target)) return target
  cache.add(target)

  let cloneTarget = {}
  if (Array.isArray(target)) {
    cloneTarget = []
  }
  Object.keys(target).forEach((k) => {
    cloneTarget[k] = deepClone(target[k])
  })
  return cloneTarget
}
```

### 处理 `symbol` 类型

`Symbol` 值作为键名，无法被`Object.keys()`、`Object.getOwnPropertyNames()`、`for..in`、`for..of`获取到。

```js
let symbol = Symbol('symbol');
let obj = { name: '二狗', [symbol]: '111' };
const obj2 = deepClone(obj);
console.log(obj2); // { name: "二狗" }
```

可以看到，深拷贝后是拿不到`Symbol`为key的属性的，这时候可以通过`Object.getOwnPropertySymbols()`来获取到对象上面所有的`Symbol`键。但是我们不仅仅需要获取`Symbol`属性，还需要获取其他属性，我们可以使用`Reflect.ownKeys()`来拿到对象的所有属性。
[mdn reflect](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect)、[mdn reflect ownKeys](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/ownKeys)

```js
function deepClone(target, cache = new WeakSet()) {
  if (!isObject(target)) return target; // 拷贝基本类型值
  if (cache.has(target)) return target;
  cache.add(target);

  let cloneTarget = Array.isArray(target) ? [] : {}; // 判断拷贝的是否是数组
  Reflect.ownKeys(target).forEach(key => {
      cloneTarget[key] = deepClone(target[key], cache); // 递归拷贝属性
  });
  return cloneTarget;
}

let symbol = Symbol('symbol');
let obj = { name: '二狗', [symbol]: '111' };
const obj2 = deepClone(obj);
console.log(obj2); // { name: "二狗"，Symbol(symbol): "111" }
```
### 处理其他引用类型

上面只处理了数组和对象，还有其他的很多引用类型的值没进行处理，我们需要先要判断要拷贝的是什么类型的对象，我们可以使用`Object.prototype.toString.call()`来获取对象的准确类型。

类型判断可以参考此文[typeof、instanceof 和 Object.prototype.toString判断类型的区别](/blog/types.html)

```js
const arrayTag = '[object Array]'
const objectTag = '[object Object]'
const mapTag = '[object Map]'
const setTag = '[object Set]'
const regexpTag = '[object RegExp]'
const boolTag = '[object Boolean]'
const numberTag = '[object Number]'
const stringTag = '[object String]'
const symbolTag = '[object Symbol]'
const dateTag = '[object Date]'
const errorTag = '[object Error]'
```
#### 创建拷贝对象

获取到了具体的引用类型后，我们可以根据对应的类型进行初始化对象的操作。通过`target.constructor`拿到拷贝对象的构造函数，通过源对象的构造函数生成的对象可以保留对象原型上的数据，如果使用`{}`，则原型上的数据会丢失。

 - `Boolean`、`Number`、`String`、`Date`、`Error`我们可以直接通过构造函数和原始数据创建一个新的对象。
 - `Object`、`Map`、`Set`我们直接执行构造函数返回初始值，递归处理后续属性，因为它们的属性可以保存对象。
 - `Array`、`Symbol`、`RegExp`进行特殊处理。


```js
function initCloneTargetByTag(target, tag) {
  const Ctor = target.constructor;
  switch (tag) {
    case boolTag:
    case dateTag:
      return new Ctor(+target);

    case numberTag:
    case stringTag:
    case errorTag:
      return new Ctor(target);

    case objectTag:
    case mapTag:
    case setTag:
      return new Ctor();

    case arrayTag:
      return cloneArray(target);

    case symbolTag:
      return cloneSymbol(target);

    case regexpTag:
      return cloneRegExp(target);
  }
}
function deepClone(target, cache = new WeakSet()) {
  ...

  const tag = Object.prototype.toString.call(target);
  let cloneTarget = initCloneTargetByTag(target, tag); // 使用拷贝对象的构造方法创建对应类型的数据

  ...
}

```

#### 初始化 Array

`cloneArray` 是为了兼容处理匹配正则时执行`exec()`后的返回结果，`exec()`方法会返回一个数组，其中包含了额外的`index`和`input`属性。

```js
function cloneArray(array) {
  const { length } = array;
  const result = new array.constructor(length);

  if (length && typeof array[0] === 'string' && hasOwnProperty.call(array, 'index')) {
      result.index = array.index;
      result.input = array.input;
  }
  return result;
}

```

#### 初始化 Symbol

```js
function cloneSymbol(symbol) {
  return Object(Symbol.prototype.valueOf.call(symbol));
}
```

#### 初始化 RegExp

```js
function cloneRegExp(regexp) {
  const reFlags = /\w*$/; // \w 用于匹配字母，数字或下划线字符，相当于[A-Za-z0-9_]
  const result = new regexp.constructor(regexp.source, reFlags.exec(regexp)); // 返回当前匹配的文本
  result.lastIndex = regexp.lastIndex; // 下一次匹配的起始索引
  return result;
}
```

#### 处理Map和Set

`map`和`set`有通过独有的`set`、`add`方法设置值，单独处理。

```js
function deepClone(target, cache = new WeakSet()) {
  ...

  if (tag === mapTag) {
    target.forEach((value, key) => {
        cloneTarget.set(key, deepClone(value, map));
    });
    return cloneTarget;
  }

  if (tag === setTag) {
    target.forEach(value => {
        cloneTarget.add(deepClone(value, map));
    });
    return cloneTarget;
  }

  ...
}

```

#### 处理函数

事实上，我们直接使用同一个内存地址的函数是没问题的，所以我们可以直接返回该函数，`lodash`上也是这么处理的。

```js
function deepClone(target, cache = new WeakSet()) {
  ...

  if (tag === functionTag) {
    return target;
  }
  
  ...
}

```

## 完整代码

```js
const arrayTag = '[object Array]'
const objectTag = '[object Object]'
const mapTag = '[object Map]'
const setTag = '[object Set]'
const functionTag = '[object Function]';
const boolTag = '[object Boolean]'
const dateTag = '[object Date]'
const errorTag = '[object Error]'
const numberTag = '[object Number]'
const regexpTag = '[object RegExp]'
const stringTag = '[object String]'
const symbolTag = '[object Symbol]'

function cloneArray(array) {
    const { length } = array;
    const result = new array.constructor(length);
  
    if (length && typeof array[0] === 'string' && hasOwnProperty.call(array, 'index')) {
        result.index = array.index;
        result.input = array.input;
    }
    return result;
}

function cloneSymbol(symbol) {
    return Object(Symbol.prototype.valueOf.call(symbol));
}

function cloneRegExp(regexp) {
    const reFlags = /\w*$/;
    const result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
    result.lastIndex = regexp.lastIndex;
    return result;
}

function initCloneTargetByTag(target, tag) {
    const Ctor = target.constructor;
    switch (tag) {
        case boolTag:
        case dateTag:
            return new Ctor(+target);

        case numberTag:
        case stringTag:
        case errorTag:
            return new Ctor(target);

        case objectTag:
        case mapTag:
        case setTag:
            return new Ctor();

        case arrayTag:
            return cloneArray(target);

        case symbolTag:
            return cloneSymbol(target);

        case regexpTag:
            return cloneRegExp(target);
    }
}

function isObject(target) {
    const type = typeof target;
    return target !== null && (type === 'object' || type === 'function');
}

function deepClone(target, cache = new WeakSet()) {
    if (!isObject(target)) return target; // 拷贝基本类型值

    if (cache.has(target)) return target;

    cache.add(target);

    const tag = Object.prototype.toString.call(target);
    let cloneTarget = initCloneTargetByTag(target, tag); // 使用拷贝对象的构造方法创建对应类型的数据

    if (tag === mapTag) {
        target.forEach((value, key) => {
            cloneTarget.set(key, deepClone(value, map));
        });
        return cloneTarget;
    }

    if (tag === setTag) {
        target.forEach(value => {
            cloneTarget.add(deepClone(value, map));
        });
        return cloneTarget;
    }

    if (tag === functionTag) {
        return target;
    }

    Reflect.ownKeys(target).forEach(key => {
        cloneTarget[key] = deepClone(target[key], cache); // 递归拷贝属性
    });

    return cloneTarget;
}

```