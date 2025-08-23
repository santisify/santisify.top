---
title: 'Vue学习笔记（一）'
tags: ['vue', '技术']
publishDate: '2025-03-10 09:47:53'
description: '语法，响应式基础，计算属性，类与样式绑定'
heroImage: { src: './img/vue3.png', color: '#4891B2' }
language: 'zh-cn'
---

部分示例来源于[vuejs中文官网](https://cn.vuejs.org/)  
  
<strong>Vue3对Vue2向下兼容，但部分不兼容</strong>  
  
## 语法  
  
### 文本插值：  
  
在`HTML`中插入文本  
  
```html  <span>Message: {{ msg }}</span>    
```  
  
### HTML插值：  
  
上述操作只能插入纯文本，可以使用`v-html`插入`html`文本  
  
```html  <p>Using text interpolation: {{ rawHtml }}</p>  
<p>Using v-html directive: <span v-html="rawHtml"></span></p>    
```  
  
### Attribute **绑定**  
  
对使用的元素属性进行绑定  想响应式绑定一个Attribute,但又不能使用`{{  }}`时,可使用`v-bind`指令：  
  
```html
<div v-bind:id="num"></div>    
```  
  
`v-bind`指令指示 Vue 将元素的`id`attribute 与组件的`num`属性保持一致。如果绑定的值是`null`或者`undefined`，那么该  attribute 将会从渲染的元素上移除。  简写：  
  
```html
<div :id="num"></div>    
```  
  
示例：  
  
```html
//点击方块后颜色切换，其中click和ref会在下面会讲到  
<template>  
    <div style="height: 100px; width: 100px;" @click="switchColor" :class="str"></div>  
</template>  
<script setup>  
    import {ref} from 'vue'  
  
    let str = ref("su");  
  
    function switchColor() {  
        str.value = "s";  
    }  
</script>  
<style scoped>  
    .su {  
        background-color: red;  
    }  
  
    .s {  
        background-color: green;  
    }  
</style>    
```  
  
也可设为bool型数据  
  
```html
<button :disabled="isButtonDisabled">Button</button>    
```  
  
当`isButtonDisabled`为[真值](https://developer.mozilla.org/en-US/docs/Glossary/Truthy)或一个空字符串 (即  
`<button disabled="">`) 时，元素会包含这个`disabled`  attribute。而当其为其他[假值](https://developer.mozilla.org/en-US/docs/Glossary/Falsy)时 attribute 将被忽略。  
  
### 动态绑定多个值  
  
如果你有像这样的一个包含多个 attribute 的 JavaScript 对象：  
  
```js
const objectOfAttrs = {  
    id: 'container',  
    class: 'wrapper',  
    style: 'background-color:green'  
}    
```  
  
通过不带参数的`v-bind`，你可以将它们绑定到单个元素上：  
  
```html
<div v-bind="objectOfAttrs"></div>    
```  
  
### 使用 JavaScript 表达式
至此，我们仅在模板中绑定了一些简单的属性名。但是 Vue 实际上在所有的数据绑定中都支持完整的 JavaScript 表达式：  
  
```html
{{ number + 1 }}  
{{ ok ? 'YES' : 'NO' }}  
{{ message.split('').reverse().join('') }}  
<div :id="`list-${id}`"></div>    
```  
  
这些表达式都会被作为 JavaScript ，以当前组件实例为作用域解析执行。  在 Vue 模板内，JavaScript 表达式可以被使用在如下场景上：  
  
- 在文本插值中 (双大括号)  
- 在任何 Vue 指令 (以`v-`开头的特殊 attribute) attribute 的值中  
  
### 仅支持表达式
  
每个绑定仅支持**单一表达式**，也就是一段能够被求值的 JavaScript 代码。一个简单的判断方法是是否可以合法地写在`return`后面。  
  
因此，下面的例子都是**无效**的：  
  
```js  
<!-- 这是一个语句，而非表达式 -->  
{  
    {  
        var a = 1  
    }  
}  
  
<!-- 条件控制也不支持，请使用三元表达式 -->  
{  
    {  
        if (ok) {  
            return message  
        }  
    }  
}    
```  
  
#### [调用函数](https://cn.vuejs.org/guide/essentials/template-syntax#calling-functions)  
  
可以在绑定的表达式中使用一个组件暴露的方法：  
  
```html
<time :title="toTitleDate(date)" :datetime="date">  
    {{ formatDate(date) }}  
</time>    
```  
  
Tip: 绑定在表达式中的方法在组件每次更新时都会被重新调用，因此**不**应该产生任何副作用，比如改变数据或触发异步操作。  
  
### 受限的全局访问
  
模板中的表达式将被沙盒化，仅能够访问到有限的全局对象列表。该列表中会暴露常用的内置全局对象，比如`Math`和`Date`。  没有显式包含在列表中的全局对象将不能在模板内表达式中访问，例如用户附加在`window`上的属性。然而，你也可以自行在`app.config.globalProperties`上显式地添加它们，供所有的  Vue 表达式使用。  
  
## 响应式基础  
  
### ref()  
  
组合式API中,使用`ref()`函数声明响应式状态  
  
```js
import {ref} from 'vue'  
  
const num = ref(100);    
```  
  
`ref()`接收参数，并将其包裹在一个带有`.value`属性的 `ref` 对象中返回  所以`vue`中的`js`需要使用组合式`setup()`，并且在使用时需要添加上`.value`  
  
示例：  
  
```html
<template>  
    <button @click="increment">  
        {{ count }}  
    </button>  
</template>  
  
<script setup>  
    import {ref} from 'vue'  
  
    const count = ref(0)  
  
    function increment() {  
        count.value++  
    }  
</script>    
```  
  
> `vue2`中使用`set()`实现响应式，而在`vue3`中使用`ref()`，并且`vue3`不兼容`set()`函数  
  
### 深层响应性  
  
Ref 可以持有任何类型的值，包括深层嵌套的对象、数组或者 JavaScript 内置的数据结构，比如`Map`。  
  
Ref 会使它的值具有深层响应性。这意味着即使改变嵌套对象或数组时，变化也会被检测到：  
  
```js
import {ref} from 'vue'  
  
const obj = ref({  
    nested: {count: 0},  
    arr: ['foo', 'bar']  
})  
  
function mutateDeeply() {  
    // 以下都会按照期望工作    
obj.value.nested.count++  
    obj.value.arr.push('baz')  
}    
```  
  
### reactive()  
  
> `reactive()`是响应式的另一种**API**，`reactive()`可使对象本身具有响应性  
  
```js
import {reactive} from 'vue'  
  
const state = reactive({count: 0})  
```  
  
在`template`中以下方式使用：  
  
```html
<template>  
    <button @click="state.cnt ++">  
        {{ state.cnt }}  
    </button>  
</template>  
```  
  
## 计算属性  
  
### 基础示例  
  
```html
<template>  
    <span>{{ author.books.length > 0 ? "YES" : "NO" }}</span>  
</template>  
  
<script setup>  
    import {reactive} from "vue";  
  
    const author = reactive({  
        name: 'John Doe',  
        books: [  
            'Vue 2 - Advanced Guide',  
            'Vue 3 - Basic Guide',  
            'Vue 4 - The Mystery'  
        ]  
    })  
</script>  
```  
  
在上述示例中，可以发现计算是依靠`author.books`的大小确定的，如果我在模板中多次使用这样的判断，是否显得过于臃肿。  
对于这样的判断可以引入`computed()`.  
  
### computed()  
  
```html
<script setup>  
    import {reactive, computed} from 'vue'  
  
    const author = reactive({  
        name: 'John Doe',  
        books: [  
            'Vue 2 - Advanced Guide',  
            'Vue 3 - Basic Guide',  
            'Vue 4 - The Mystery'  
        ]  
    })  
  
    // 一个计算属性 ref  
    const publishedBooksMessage = computed(() => {  
        return author.books.length > 0 ? 'Yes' : 'No'  
    })  
</script>  
  
<template>  
    <p>Has published books:</p>  
    <span>{{ publishedBooksMessage }}</span>  
</template>  
```   
我们在这里定义了一个计算属性`publishedBooksMessage`。`computed()`  
方法期望接收一个[getter 函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/get#description)  
，返回值为一个**计算属性 ref**。和其他一般的 ref 类似，你可以通过`publishedBooksMessage.value`访问计算结果。计算属性 ref  
也会在模板中自动解包，因此在模板表达式中引用时无需添加`.value`。  
  
Vue 的计算属性会自动追踪响应式依赖。它会检测到`publishedBooksMessage`依赖于`author.books`，所以当`author.books`改变时，任何依赖于  
`publishedBooksMessage`的绑定都会同时更新。  
  
### 可写计算属性  
  
计算属性默认是只读的。当你尝试修改一个计算属性时，你会收到一个运行时警告。只在某些特殊场景中你可能才需要用到“可写”的属性，你可以通过同时提供  
getter 和 setter 来创建：  
  
```js
<template>  
    {{fullName}}  
</template>  
<script setup>  
    import {ref, computed} from 'vue'  
  
    const firstName = ref('John')  
    const lastName = ref('Doe')  
  
    const fullName = computed({  
    // getter    
    get() {  
    return firstName.value + ' ' + lastName.value  
},  
    // setter    
    set(newValue) {  
    // 注意：我们这里使用的是解构赋值语法    
    [firstName.value, lastName.value] = newValue.split(' ')  
}})  
  
    console.log(fullName.value, firstName.value, lastName.value);  
  
    fullName.value = "Jack Doe";  
  
    console.log(fullName.value, firstName.value, lastName.value);  
</script>  
```  
  
在上述示例中，当运行`fullName.value = "Jack Doe";`时，`firstName`和`lastName`也会随之更新。  
  
## 类与样式绑定  
  
### 绑定HTML class  
  
#### 绑定对象  
  
绑定对象一般使用`v-bind`，比如绑定`class`一般写为`v-bind:class` 简写为`:class`,对其传递对象可动态切换class：  
  
```html
<div :class="{ active: isActive }"></div>  
```  
  
其中class的`active`是否存在由`isActive`的真值来确定。  
对象中可通过多个字段class对象  
例如：  
  
```html
<template>  
    <div  
            class="static"  
            :class="{ active: isActive, 'text-danger': hasError }">  
        123  
    </div>  
</template>  
<script setup>  
    import {ref} from "vue";  
  
    const isActive = ref(true)  
    const hasError = ref(false)  
</script>  
  
<style scoped>  
    .text-danger {  
        color: red;  
    }  
</style>  
```  
  
在上述示例中，字段`active, hasError` 的真值影响在class类中是否存在对应的类名。当`hasError`为真时，由于css中的`text-danger`  
样式，会将字体**123**改变为红色。  
上述示例渲染后的效果如下：  
  
```html
<div class="static active"> 123</div>  
```  
  
通过以上，我们可以对`：class`传入一个对象  
  
```html
<template>  
    <div  
            class="static"  
            :class="obj">  
        123  
    </div>  
</template>  
<script setup>  
    import {reactive} from "vue";  
  
    const obj = reactive({  
        active: true,  
        'text-danger': false,  
    })  
</script>  
  
<style scoped>  
    .text-danger {  
        color: red;  
    }  
</style>  
```  
  
传入对象方法渲染后的效果同上，个人较为喜欢多个字段操作  
  
我们也可以绑定一个返回对象的[[#计算属性]]。这是一个常见且很有用的技巧：  
  
```js
const isActive = ref(true)  
const error = ref(null)  
  
const obj = computed(() => ({  
    active: isActive.value && !error.value,  
    'text-danger': error.value && error.value.type === 'fatal'  
}))  
```  
  
```html  
  
<div :class="classObject"></div>  
```  
  
#### 绑定数组  
  
我们可以给`:class`绑定一个数组来渲染多个 CSS class：  
  
```js
const activeClass = ref('active')  
const errorClass = ref('text-danger')  
```  
  
```html
<div :class="[activeClass, errorClass]"></div>  
```  
  
渲染的结果是：  
  
```html
<div class="active text-danger"></div>  
```  
  
如果你也想在数组中有条件地渲染某个 class，你可以使用三元表达式：  
  
```html
<div :class="[isActive ? activeClass : '', errorClass]"></div>  
```  
  
`errorClass`会一直存在，但`activeClass`只会在`isActive`为真时才存在。  
  
然而，这可能在有多个依赖条件的 class 时会有些冗长。因此也可以在数组中嵌套对象：  
  
```html
<div :class="[{ [activeClass]: isActive }, errorClass]"></div>  
```  
  
#### 在组件上使用  
  
> 本节假设你已经有[Vue 组件](https://cn.vuejs.org/guide/essentials/component-basics.html)的知识基础。如果没有，你也可以暂时跳过，以后再阅读。  
  
对于只有一个根元素的组件，当你使用了`class`attribute 时，这些 class 会被添加到根元素上并与该元素上已有的 class 合并。  
  
举例来说，如果你声明了一个组件名叫`MyComponent`，模板如下：  
  
```html
<!-- 子组件模板 -->  
<p class="foo bar">Hi!</p>  
```  
  
在使用时添加一些 class：  
  
```html
<!-- 在使用组件时 -->  
<MyComponent class="baz boo"/>  
```  
  
渲染出的 HTML 为：  
  
```html
<p class="foo bar baz boo">Hi!</p>  
```  
  
Class 的绑定也是同样的：  
  
```html
<MyComponent :class="{ active: isActive }"/>  
```  
  
当`isActive`为真时，被渲染的 HTML 会是：  
  
```html
<p class="foo bar active">Hi!</p>  
```  
  
如果你的组件有多个根元素，你将需要指定哪个根元素来接收这个 class。你可以通过组件的`$attrs`属性来指定接收的元素：  
  
```html
<!-- MyComponent 模板使用 $attrs 时 -->  
<p :class="$attrs.class">Hi!</p>  
<span>This is a child component</span>  
```  
  
```html
<MyComponent class="baz"/>  
```  
  
这将被渲染为：  
  
```html
<p class="baz">Hi!</p>  
<span>This is a child component</span>  
```  
  
你可以在透传 Attribute一章中了解更多组件的 attribute 继承的细节。  
  
### 绑定内联样式  
  
#### 绑定对象  
  
`:style`支持绑定 JavaScript 对象值，对应的是HTML 元素的`style`属性：  
  
```js
const activeColor = ref('red')  
const fontSize = ref(30)  
```  
  
```html
<div :style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>  
```  
  
尽管推荐使用 camelCase，但`:style`也支持 kebab-cased 形式的 CSS 属性 key (对应其 CSS 中的实际名称)，例如：  
  
```html
<div :style="{ 'font-size': fontSize + 'px' }"></div>  
```  
  
直接绑定一个样式对象通常是一个好主意，这样可以使模板更加简洁：  
  
```js
const styleObject = reactive({  
    color: 'red',  
    fontSize: '30px'  
})  
```  
  
```html
<div :style="styleObject"></div>  
```  
  
同样的，如果样式对象需要更复杂的逻辑，也可以使用返回样式对象的计算属性。  
  
#### 绑定数组  
  
我们还可以给`:style`绑定一个包含多个样式对象的数组。这些对象会被合并后渲染到同一元素上：  
  
```html
<div :style="[baseStyles, overridingStyles]"></div>  
```  
  
#### 自动前缀  
  
当你在`:style`中使用了需要[浏览器特殊前缀](https://developer.mozilla.org/en-US/docs/Glossary/Vendor_Prefix)的 CSS  
属性时，Vue 会自动为他们加上相应的前缀。Vue 是在运行时检查该属性是否支持在当前浏览器中使用。如果浏览器不支持某个属性，那么将尝试加上各个浏览器特殊前缀，以找到哪一个是被支持的。  
  
#### 样式多值  
  
你可以对一个样式属性提供多个 (不同前缀的) 值，举例来说：  
  
```html
<div :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>  
```  
  
数组仅会渲染浏览器支持的最后一个值。在这个示例中，在支持不需要特别前缀的浏览器中都会渲染为`display: flex`。
