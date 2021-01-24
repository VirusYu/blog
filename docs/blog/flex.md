---
title: Flex弹性布局实现九种骰子布局
date: 2021-01-24
tags:
 - CSS
 - Flex
 - 前端
categories:
 - CSS
 - 技术分享
publish: true
---
[[toc]]

## 前言

之前在面度小满金融的时候，面试官问我如果用flex实现筛子三点的布局，当时我比较懵，因为常用的也就是 `flex-flow`、`justify-content`、`align-item`、`flex: 1`这几个属性，其实筛子三点布局是用到了 `align-self`这个属性去改变元素自身的flex属性

首先来介绍 `align-self` , 引用[MDN文档](https://developer.mozilla.org/zh-cn/docs/web/css/align-self)的介绍`align-self` 会对齐当前 `grid` 或 `flex` 行中的元素，并覆盖已有的 `align-items` 的值。默认值为`auto`，也就是继承父元素的`align-items`。

## 基础布局

骰子基本布局如下：

```html
<div class="dice-box flex">
  <div class="dice-item"></div>
</div>
```
效果如下：

![image](/image/flex/flex-1.png)

## 一点

一点其实最简单，就是考验垂直水平居中;

![image](/image/flex/flex-2.png)

```html
<style>
  .dice-box {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
<div class="dice-box flex">
  <div class="dice-item"></div>
</div>
```

## 两点 & 三点

两点三点就会用到 `align-items` 这个属性了

![image](/image/flex/flex-3.png)

```html
<style>
  .dice-box {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .box-2 {
    display: flex;
    justify-content: space-between;
  }
  .box-2 .dice-item:nth-child(2) {
    align-self: flex-end;
  }
</style>
<div class="dice-box flex box-2">
  <div class="dice-item"></div>
  <div class="dice-item"></div>
</div>
```


![image](/image/flex/flex-4.png)

```html
<style>
  .dice-box {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .box-3 {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .box-3 .dice-item:nth-child(1) {
    align-self: flex-start;
  }

  .box-3 .dice-item:nth-child(3) {
    align-self: flex-end;
  }
</style>
<div class="dice-box flex box-3">
  <div class="dice-item"></div>
  <div class="dice-item"></div>
  <div class="dice-item"></div>
</div>
```
## 四点 & 五点 & 六点

四点的html结构与之前有细微的区别，主要是为了将html划分为上下两行，并在父元素使用 `flex-wrap: wrap;`设置元素换行，子元素中使用 `flex-basis: 100%;`设置初始化的宽度，来达到换行的目的。


![image](/image/flex/flex-5.png)

```html
<style>
  .dice-box {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .box-4 {
    flex-wrap: wrap;
    justify-content: space-around;
  }
  .box-4 .flex-column {
    flex-basis: 100%;
    display: flex;
    justify-content: space-between;
  }
</style>
<div class="dice-box flex box-4">
  <div class="flex-column">
    <div class="dice-item"></div>
    <div class="dice-item"></div>
  </div>
  <div class="flex-column">
    <div class="dice-item"></div>
    <div class="dice-item"></div>
  </div>
</div>
```

五点的话无非就是多了一行，而且中间这一样只有一个子元素

![image](/image/flex/flex-6.png)

```html
<style>
  .dice-box {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .box-5 {
    flex-wrap: wrap;
    justify-content: space-around;
  }
  .box-5 .flex-column {
    flex-basis: 100%;
    display: flex;
    justify-content: space-between;
  }
  .box-5 .flex-column:nth-child(2) {
    justify-content: center;
  }
</style>
<div class="dice-box flex box-5">
  <div class="flex-column">
    <div class="dice-item"></div>
    <div class="dice-item"></div>
  </div>
  <div class="flex-column">
    <div class="dice-item"></div>
  </div>
  <div class="flex-column">
    <div class="dice-item"></div>
    <div class="dice-item"></div>
  </div>
</div>
```

六点的话是三行，每行有两个，跟四个其实是一样的


![image](/image/flex/flex-7.png)

```html
<style>
  .dice-box {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .box-6 {
    flex-wrap: wrap;
    justify-content: space-around;
  }
  .box-6 .flex-column {
    flex-basis: 100%;
    display: flex;
    justify-content: space-between;
  }
</style>
<div class="dice-box flex box-6">
  <div class="flex-column">
    <div class="dice-item"></div>
    <div class="dice-item"></div>
  </div>
  <div class="flex-column">
    <div class="dice-item"></div>
    <div class="dice-item"></div>
  </div>
  <div class="flex-column">
    <div class="dice-item"></div>
    <div class="dice-item"></div>
  </div>
</div>
```

## 附录

以下是整体的代码

```html

<!DOCTYPE html>
<html >
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>flex</title>
  </head>
  <body>
    <style>
      body {
        padding: 40px;
        background-color: #333;
      }
      .flex {
        display: flex;
      }
      .dice-box {
        float: left;
        margin-right: 20px;
        box-sizing: border-box;
        width: 100px;
        height: 100px;
        padding: 10px;
        border-radius: 10px;
        background: #ececec;
      }
      .dice-item {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: rgb(216, 35, 35);
      }
      .box-1 {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .box-2 {
        display: flex;
        justify-content: space-between;
      }

      .box-2 .dice-item:nth-child(2) {
        align-self: flex-end;
      }

      .box-3 {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .box-3 .dice-item:nth-child(1) {
        align-self: flex-start;
      }

      .box-3 .dice-item:nth-child(3) {
        align-self: flex-end;
      }
      .box-4 {
        flex-wrap: wrap;
        justify-content: space-around;
      }
      .box-4 .flex-column {
        flex-basis: 100%;
        display: flex;
        justify-content: space-between;
      }

      .box-5 {
        flex-wrap: wrap;
        justify-content: space-around;
      }
      .box-5 .flex-column {
        flex-basis: 100%;
        display: flex;
        justify-content: space-between;
      }
      .box-5 .flex-column:nth-child(2) {
        justify-content: center;
      }

      .box-6 {
        flex-wrap: wrap;
        justify-content: space-around;
      }
      .box-6 .flex-column {
        flex-basis: 100%;
        display: flex;
        justify-content: space-between;
      }
    </style>
    <div class="dice-box flex box-1">
      <div class="dice-item"></div>
    </div>

    <div class="dice-box flex box-2">
      <div class="dice-item"></div>
      <div class="dice-item"></div>
    </div>

    <div class="dice-box flex box-3">
      <div class="dice-item"></div>
      <div class="dice-item"></div>
      <div class="dice-item"></div>
    </div>

    <div class="dice-box flex box-4">
      <div class="flex-column">
        <div class="dice-item"></div>
        <div class="dice-item"></div>
      </div>
      <div class="flex-column">
        <div class="dice-item"></div>
        <div class="dice-item"></div>
      </div>
    </div>

    <div class="dice-box flex box-5">
      <div class="flex-column">
        <div class="dice-item"></div>
        <div class="dice-item"></div>
      </div>
      <div class="flex-column">
        <div class="dice-item"></div>
      </div>
      <div class="flex-column">
        <div class="dice-item"></div>
        <div class="dice-item"></div>
      </div>
    </div>

    <div class="dice-box flex box-6">
      <div class="flex-column">
        <div class="dice-item"></div>
        <div class="dice-item"></div>
      </div>
      <div class="flex-column">
        <div class="dice-item"></div>
        <div class="dice-item"></div>
      </div>
      <div class="flex-column">
        <div class="dice-item"></div>
        <div class="dice-item"></div>
      </div>
    </div>
  </body>
</html>


```