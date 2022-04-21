# vue-form-create

基于 Vue3.0 + vite + element-plus + TS 的自定义表单生成器。

![预览](https://user-images.githubusercontent.com/32807958/163714729-de4ce227-0651-4637-8cd0-b0491179c449.png)

### 支持功能

- 远端数据获取
- 图片上传
- 栅格布局
- 生成 JSON

### 演示地址

[https://zmjs-form-design.netlify.app/](https://zmjs-form-design.netlify.app/)

### npm

[https://www.npmjs.com/package/@zmjs/form-design](https://www.npmjs.com/package/@zmjs/form-design)

## 1 安装

```shell
$ pnpm install @zmjs/form-design
```

```shell
$ yarn add @zmjs/form-design
```
### 示例

**npm 引入**

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import {DesignForm} from '@zmjs/form-design'

createApp(App)
  .use(DesignForm)
  .mount('#app')
```
## 2 组件说明

### 表单设计器（FormDesign）

#### 示例

```html
<template>
  <FormDesign ref="formDesign" />
</template>
```

#### API

##### Props

|     参数      |          说明          |  类型   | 默认值 |
| :-----------: | :--------------------: | :-----: | :----: |
|    preview    |   设计器预览操作按钮   | boolean |  true  |
| generateJson  |  设计器生成 Json 按钮  | boolean |  true  |
|  uploadJson   |  设计器导入 JSON 按钮  | boolean |  true  |
|   clearable   |     设计器清空按钮     | boolean |  true  |
|  basicFields  | 设计器左侧基础字段配置 |  array  |   -    |
| advanceFields | 设计器左侧高级字段配置 |  array  |   -    |
| layoutFields  | 设计器左侧布局字段配置 |  array  |   -    |

##### 方法

通过 ref 可以获取到实例并调用实例方法

|      方法名       |                说明                |             参数              |
| :---------------: | :--------------------------------: | :---------------------------: |
|     getJson()     |     获取设计器配置的 JSON 数据     |               -               |
|  setJson(value)   |        设置设计器的配置信息        |    通过 getJson 获取的数据    |
|      clear()      |             清空设计器             |                               |

### 表单生成器（GenerateForm）

#### 示例

```html
<template>
  <GenerateForm ref="generateForm" />
</template>
```

#### API

##### Props

|   参数   |                     说明                      |  类型   | 默认值 |
| :------: | :-------------------------------------------: | :-----: | :----: |
|   data   | 表单 json 配置数据（从表单设计器获取的 json） | object  |   -    |
|  value   |     表单数据（从表单生成器获取的 value）      | object  |   -    |
| disabled |                   是否禁用                    | boolean | false  |

##### 方法

通过 ref 可以获取到实例并调用实例方法

|  方法名   |             说明             |          参数           |
| :-------: | :--------------------------: | :---------------------: |
| getData() | 获取表单数据（返回 Promise） |            -            |
|  reset()  |         重置表单数据         | 通过 getJson 获取的数据 |

## 3 功能说明

### 远端数据

单选框，多选框，下拉选择框、级联选择器等选择项需要通过数据生成，这时可以配置远端数据。

设置远端方法地址与返回值。

![](https://ftp.bmp.ovh/imgs/2021/04/63b3a638b9a9d251.png)

### 文件上传

填写服务器上传地址、参数名等配置信息。

![](https://ftp.bmp.ovh/imgs/2021/04/91624bc0a32bad63.png)