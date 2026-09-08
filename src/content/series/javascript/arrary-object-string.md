---
title: ES6中字符串、对象、数组新特性
tags:
  - javascript
  - ES6
publishDate: 2026-09-08 21:00
updateData: 2026-09-08 21:00
description: 字符串、对象、数组的解构及扩展
language: zh-cn
series: javascript
comment: false
---
##  解构
### 数组解构
完全解构
```js
let a, b;
[a, b] = [1, 2]
console.log(a, b); // 1 2
```
部分解构
```js
let [a, b] = [1, 2, 3];
console.log(a, b) // 1 2

let [x, y, z] = [1, 2];
console.log(x, y, z) // 1 2 undefined
```
忽略方式解构
```js
let [, , a] = [1, 2, 3];
console.log(a); // 3
```
嵌套解构
```js
let [a, b, [c]] = ['a', 'b', ['c']];
console.log(a, b, c); //a b c
```
剩余运算符解构
```js
let [a, ...b] = [1, 2, 3, 4, 5]
console.log(a) // 1
console.log(b) // [ 2, 3, 4, 5 ]
```
解构默认值
```js
let [a, b] = [1]
console.log(a, b) // 1 undefined
let [x, y = 2] = [1]
console.log(x, y) // 1 2
let [u, v = 2] = [1, 3]
console.log(u, v) // 1 3
```
使用场景：
1. 实现两数交换
   ```js
let a = 10, b = 20
console.log(a, b); // 10 20
[a, b] = [b, a]
console.log(a, b); // 20 10
   ```
2. 使用函数返回值
```js
function fn() {
    return [1, 2, 3];
}
let [a, b, c] = fn();
console.log(a, b, c); // 1 2 3
```

### 对象解构
完全解构
```js
let obj = {
    name: "John Doe",
    age: 32,
}
{
    let {name, age} = obj;
    console.log(name, age) // John Doe 32
}
{
    let {age, name} = obj;
    console.log(name, age) // John Doe 32
}
```
部分解构
```js
let obj = {
    name: "John Doe",
    age: 32,
}
let {age} = obj
console.log(age) // 32
let {addr, name} = obj
console.log(addr, name)// undefined John Doe
```
解构后重命名
```js
let obj = {
    name: "John Doe",
    age: 32,
}
let {name: username, age: userage} = obj
console.log(username, userage) // John Doe 32
```
剩余运算符解构（浅拷贝）
```js
let obj = {
    name: "John Doe",
    age: 32,
    email: 'xh@example.com'
}
let {name, ...res} = obj
console.log(name) // John Doe
console.log(res) // { age: 32, email: 'xh@example.com' }

```
解构默认值
```js
let obj = {
    name: "John Doe",
    age: 32,
    email: 'xh@example.com'
}
let {name, img = 'a.webp'} = obj
console.log(name, img) // John Doe a.webp
let {age = 10, email} = obj
console.log(age, email) // 32 xh@example.com
```

使用场景：
	函数返回值
```js
function fn() {
    return {name: "santisify", age: "22", email: "xh@example.com"}
}
let {name}= fn();
console.log(name) // santisify
```
### 字符串解构
```js
let str = "hfkjdsaj"
let [a, b, c, d] = str
console.log(a, b, c, d) // h f k j
let {length} = str
console.log(length) // 8
```

## 字符串扩展
### 模板字符串
```js
let str = "hello world";

console.log(`hello, ${str} , world!`);// hello, hello world , world!
```
### 新增方法
 ```js
let str = "hello world";
// includes() 判断是否包含 返回 true/false
console.log(str.includes("he")); // true
console.log(str.includes("ho")); // false
// startsWith() 判断目标字符串是否在源字符串头部 返回 true/false
console.log(str.startsWith('h')); // true
console.log(str.startsWith('e')); // false
// endsWith() 判断目标字符串是否在源字符串尾部 返回 true/false
console.log(str.endsWith('ld')); // true
console.log(str.endsWith('l')); // false
// repeat() 将字符串重复n次 返回重复后的字符串
console.log(str.repeat(3));// hello worldhello worldhello world 
 ```
## 对象扩展
### 新特性
属性和方法简洁表达方式
	若属性名和接收的变量名相同，可直接使用变量名作为属性名
	方法 方法名(){}
```js
let router = "router"
let vue = {
    router, // 等同于 router:touter
    data(){
        console.log("fn-data")
    }
    // 等同于
    // data:function(){
    //     console.log("fn-data")
    // }
}
console.log(vue)
vue.data()
```
表达式方式的属性名和方法名
```js
let obj = {
    ['na'+'me']: 'santisify',
    ['say'+'hello']() {
        console.log('hello')
    }
}
console.log(obj.name) // santisify
obj.sayhello() // hello
```
### 新增方法

```js
// Object.assign() 对象合并
{
    let a = {name: 'santisify'};
    let b = {age: 32};
    let res = Object.assign(a, b);
    console.log(res); // { name: 'santisify', age: 32 }
    console.log(a, b); // { name: 'santisify', age: 32 } { age: 32 }
}
{
    let a = {name: 'santisify'};
    let b = {age: 32};
    let res = Object.assign({}, a, b);
    console.log(res); // [String: ''] { name: 'santisify', age: 32 }
    console.log(a, b); // { name: 'santisify'} { age: 32 }
}

{ // 若存在相同属性，则后面的对象覆盖
    let a = {width: 100}
    let b = {width: 200}
    let res = Object.assign({}, a, b);
    console.log(res); // { width: 200 }
}

// Object.is() 比较两值是否严格相等
{
    console.log(Object.is("1", 1)) // false
    console.log(Object.is(1, 1)) // true
    // 对象比较地址
    console.log(Object.is({}, {})) // false
}
```
## 数组扩展
扩展运算符号
```js
let a = ['a', 'b', 'c']
let b = ['d', 'e', 'f']
{
    let z = [...a, ...b] // arr2 = arr1.concat()
    a.push('d')
    console.log(a, b, z) // [ 'a', 'b', 'c', 'd' ] [ 'd', 'e', 'f' ] [ 'a', 'b', 'c', 'd', 'e', 'f' ]
}
```
新方法
```js
// find(callback) 找出第一个符合条件的数组成员
{
    let a = [1, 2, 3, 4, 5]
    let res = a.find((iterm) => {
        return iterm > 3
    })
    console.log(res) // 4
}
// findIndex(callback) 找出第一个符合条件的数组成员下标
{
    let a = [1, 2, 3, 4, 5]
    let res = a.findIndex((iterm) => {
        return iterm > 3
    })
    console.log(res) // 3
}
// Array.of() 将一组值转化为数组
{
	console.log(Array.of(1, 2, 3)) // [ 1, 2, 3 ]
}
// Array.from(obj[,fn]) 将对像转化为真正的数组
// 转化条件需要可遍历的对象，需要有length属性
{
     function fn() {
         console.log("arguments:", arguments);
         Array.from(arguments).forEach((item) => {
             console.log(item);
         });
     }
     fn("zhangsan", "lisi")// zhangsan
                           // lisi
}
```
