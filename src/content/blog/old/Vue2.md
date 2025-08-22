---
title: 'Vue学习笔记（二）'
tags: ['vue', '技术']
publishDate: '2025-03-15 11:06:32'
description: '组件基础，props（父组件 -> 子组件），监听事件'
heroImage: { src: './img/vue3.png', color: '#4891B2' }
language: 'zh-cn'
---
# 组件基础

## 组件定义
Vue组件定义在一个`.vue`的文件中，被称为单文件组件`SFC` :
```html
<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">You clicked me {{ count }} times.</button>
</template>
```

## 组件使用
若要使用一个子组件，需要在父组件中导入。假设我们把计数器组件放在了一个叫做 `ButtonCounter.vue` 的文件中，这个组件将会以默认导出的形式被暴露给外部：
```html
<script setup>
import ButtonCounter from './ButtonCounter.vue'
</script>

<template>
  <h1>Here is a child component!</h1>
  <ButtonCounter />
</template>
```

若是通过 `<script setup>` 导入的组件，可以在`<template> </template>` 中直接使用。同时，一个组件可在同一个模板中引用多次：
```html
<template>
  <ButtonCounter />
  <ButtonCounter />
  <ButtonCounter />
</template>
```
对于以上的示例，每个`ButtonCounter` 组件在进行点击后不会影响其余的组件，因为每个组件都是维护自己的状态，每当我使用一个组件就新创建一个实例。

##  传递 props
如果我们正在构建一个博客，我们可能需要一个表示博客文章的组件。我们希望所有的博客文章分享相同的视觉布局，但有不同的内容。要实现这样的效果自然必须向组件中传递数据，例如每篇文章标题和内容，这就会使用到 props。

Props 是一种特别的 attributes，你可以在组件上声明注册。要传递给博客文章组件一个标题，我们必须在组件的 props 列表上声明它。这里要用到 `defineProps` 宏：

```html
<!-- BlogPost.vue -->
<script setup>
defineProps(['title'])
</script>

<template>
  <h4>{{ title }}</h4>
</template>
```

`defineProps` 是一个仅 `<script setup>` 中可用的编译宏命令，并不需要显式地导入。声明的 props 会自动暴露给模板。`defineProps` 会返回一个对象，其中包含了可以传递给组件的所有 props：
```js
const props = defineProps(['title'])
console.log(props.title)
```

一个组件可以有任意多的 props，默认情况下，所有 prop 都接受任意类型的值。
当一个 prop 被注册后，可以像这样以自定义 attribute 的形式传递数据给它：

```html
<BlogPost title="My journey with Vue" />
<BlogPost title="Blogging with Vue" />
<BlogPost title="Why Vue is so fun" />
```

在实际应用中，我们可能在父组件中会有如下的一个博客文章数组：

```js
const posts = ref([
  { id: 1, title: 'My journey with Vue' },
  { id: 2, title: 'Blogging with Vue' },
  { id: 3, title: 'Why Vue is so fun' }
])
```
这种情况下，我们可以使用 `v-for` 来渲染它们：
``` html
<BlogPost
  v-for="post in posts"
  :key="post.id"
  :title="post.title"
 />
```

留意我们是如何使用 `v-bind` 语法(`:title="post.title"`) 来传递动态 prop 值的。当事先不知道要渲染的确切内容时，这一点特别有用。

## 监听事件
