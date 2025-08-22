---
title: npm作为图片存储
tags: [ 'npm', '存储' ]
publishDate: '2025-01-08 23:19:34'
description: ''
heroImage: { src: './img/npm-logo.jpg', color: '#4891B2' }
language: 'zh-cn'
---

# 创建文件夹
```bash
mkdir demo
```
# 初始化
```bash
npm init -y
```

# 打开编译器创建文件`index.js`并填入以下信息
```js
function main () {
    console.log("Hello, world");
}
main();
export default main;
export function Hello(name) {
    console.log('${ name }}');
}
```
# 打开package.json文件
现在我们来熟悉下这个文件。

| 字段             | 备注                         |
| -------------- | -------------------------- |
| name           | npm包的名称，也就是publish后的名称     |
| version        | 每次publish的时候记得修改这个，必须要是新版本 |
| desdescription | 对这个npm包的描述                 |
| main           | 链接到这个包后，默认打开的文件            |
| keywords       | 关键词。若是自行使用，可以不配置           |
| author         | 作者。填写自己的用户名就行              |

现在在**json**文件中添加以下信息
```json
"files": ["index.js", ""]
```
在`[]`中添加需要发布的文件或文件夹，多个文件或文件夹用`,`隔开并且每个都用`""`包裹。
自行检查语法错误
# 发布
由于镜像源问题，我们可能会发布失败
我们直接在**cmd**中切换镜像源
```bash
npm config set registry https://registry.npmjs.org
```
切换后发布
```bash
npm publish
```
发布成功后我们再将镜像源切换回
```bash
npm config set registry https://registry.npmmirror.com
```
若不切换，可能会出现 `npm install` 失败

# 访问文件
访问npm包的文件我们可以使用[unpkg](https://www.unpkg.com)来访问
以下链接是访问最新发布的npm包
```
https://unpkg.com/npm包名/file
```
若在包名后添加`@版本号`，则可以访问指定版本的npm包
```bash
# 准确版本号
https://unpkg.com/npm包名@1.1.1/file
# 模糊版本号(访问的是这个大版本的最新的版本号)
https://unpkg.com/npm包名@1/file
# 模糊版本号(访问的是这个小版本的最新的版本号)
https://unpkg.com/npm包名@1.1/file
```
好了，今天的分享就到这里了，拜拜！
