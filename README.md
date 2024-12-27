# vite-vue-auto-load-router
## 介绍
基于 vite + vue3 + vue-router 实现的自动路由生成工具
2行代码即可将指定目录下的 vue 文件自动生成`createRouter`方法所需要路由数据。


## 特性
1. 自动生成路由数据
2. 自动设置路由名称
3. 以`_`开头的文件会被设置成路由参数，如`item/_id.vue`对应的路由路径为`/item/:id`
4. 可以在`vue`文件中使用`defineOptions`方法(组合式api、`vue3.3+`，或非`<script setup>`时在`export default`中增加`route`字段)自定义路由配置项
5. 清除前缀后路径为`index`的路由会自动设置名为`/`的alias
6. 在`defineOptions`中导出`component`为`undefined`时，不会设置路由的`component`属性

## 安装
```bash
npm i vite-vue-auto-router
```
## 使用

```javascript
// router.js
import {createRouter, createWebHistory} from "vue-router";
import loadRouter from "vite-vue-auto-router"

const router = createRouter({
    history: createWebHistory(import.meta.env.VITE_PATH??""),
    routes: await loadRouter(import.meta.glob('@/pages/**.vue')),
})

export default router
```
```javascript
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'

createApp(App).use(router).mount('#app')
```

## 参数
第一个参数为`import.meta.glob`方法的返回值，第二个参数为路由配置项。  
由于`import.meta.glob`方法传入的第一个参数必须是字面量字符串，所以无法使用变量，所以必须手动调用该方法。  
`import.meta.glob`的具体使用请参阅[vite文档](https://cn.vitejs.dev/guide/features.html#glob-import)。  
第二个参数为可选参数，默认为`{routerPrefix: "/", clearPathPrefix: true, setName: true}`。  

| 参数名             | 默认值    | 参数类型            | 描述                                                  |
|-----------------|--------|-----------------|-----------------------------------------------------|
| routerPrefix    | `/`    | `string`        | 路由前缀                                                |
| clearPathPrefix | `true` | `true`/`string` | 清除路径前缀，为`true`时清除所有`.vue`文件路径的共同前缀；为`string`时清除指定前缀 |
| setName         | `true` | `boolean`       | 是否设置路由名称，为`true`时将文件名作为路由名称；为`false`时不设置路由名称        |

## 示例
```
pages
├── index.vue
├── item.vue
└── item
    |── name.vue
    └── _id.vue
```
使用默认参数生成的路由数据如下：
```
{path:"/index",name:"index",alias:"/",component:()=>import("./pages/index.vue")},
{path:"/item",name:"item",component:()=>import("./pages/item.vue")},
{path:"/item/name",name:"item-name",component:()=>import("./pages/item/name.vue")},
{path:"/item/:id",name:"item-id",component:()=>import("./pages/item/_id.vue")},
```
将`routerPrefix`设置为空字符串，path将不会自动添加前缀，适用于嵌套式路由的子路由：
```
{path:"index",name:"index",alias:"/",component:()=>import("./pages/index.vue")},
{path:"item",name:"item",component:()=>import("./pages/item.vue")},
{path:"item/name",name:"item-name",component:()=>import("./pages/item/name.vue")},
{path:"item/:id",name:"item-id",component:()=>import("./pages/item/_id.vue")},
```
在`index.vue`中使用`defineOptions`方法自定义路由配置项：
```javascript
defineOptions({
    route:{
        meta:{
            title:'首页'
        },
        children:[
            {
                path:'children',
                component:TheWelcome
            }
        ],
        component:undefined,
        path:"/",
    }
})
```
或非`<script setup>`时在`export default`中增加`route`字段：
```javascript
export default {
    data(){
        
    },
    route:{
        meta:{
            title:'首页'
        },
        children:[
            {
                path:'children',
                component:TheWelcome
            }
        ],
        component:undefined,
        path:"/",
    }
}
```
生成的路由数据如下：
```
{
    meta:{
        title:'首页'
    },
    children:[
        {
            path:'children',
            component:TheWelcome
        }
    ],
    path:"/",
    alias:'/',
    name:'index',
}
```