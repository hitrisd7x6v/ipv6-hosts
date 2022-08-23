### ivzone2.0更新说明
ivzone2.0基于vite2.0+vue3.0+antdv2+vuex4.0+vuerouter4, 此次更新不兼容1.0版本，是重新出发重新整理的一个版本，使用单页面架构(spa). 此版本对antd2的一些常用组件进行了简易封装比如：表格，表单。并且提供了增删改查视图页组件，模态框编辑框组件以及其他组件；在后续将会提供更多的简单方便且灵活的组件。还有此版本是一个纯前端版， 没有和任何后端集成，基于java后端的集成版本还在开发适配中
### 核心功能
1. 是一套简易美观的基础功能框架(基于antd2的ui组件库)，基本可以开箱即用
2. 提供一套增删改查组件，做了简单封装，使用简单灵活，代码量降低30%+
3. 支持动态路由即从后端生成路由信息，支持从菜单信息中动态生成功能点(增删改查，导入、导出以及其他自定义功能等)
4. 封装antd中table组件的不友好使用方式，可以自定义列的slot
5. 增强ATable组件功能，新增dict和url字段，使得table列可以将值转换成对应的标签(label)比如：使用字典和url
6. 增强options(select,checkbox,autocomplete,tree,radio)等组件，支持使用字典和url动态生成
7. 增强form表单功能， 支持自动根据字段动态生成model数据，支持路径嵌套(a.b)
8. 支持对第三方库独立打包，降低每次应用更新时浏览器缓存失效问题
9. 提供基于antd2ui库封装的其他业务组件库
10. 使用Mock对所有视图组件进行数据模拟
11. 不依赖于后台框架的使用语言(java, php, c#等)， 友好的声明api接口和字段，可以方便的对接任何后台
### 增删改查视图组件
  将通用的，常用的，简单的一些操作合并到一个组件里面且提供完整的增删改查功能。对于每个通用的增删改查功能，最大的不同点在于操作的url不同，需要的功能点不同，所以我们只需要将每个功能点交由开发人员定义。下面主要是两个常用的增删改查视图组件的实现，先直观看一下菜单功能用增删改查组件的实现图片和对应的代码
![输入图片说明](https://images.gitee.com/uploads/images/2021/0603/191912_c1cbc101_1230742.png "1622719064(1).png")
#### IvzFuncView视图
IvzFuncView组件时增删改查的一种实现方式，通过显式自定义功能点来实现，如下：

```
<template>
  <ivz-func-view :editFunMetas="editFunMetas" name="菜单"
         :tableFunMetas="tableFunMetas" :searchFunMetas="searchFunMetas">
    <ivz-view-search>
      <ivz-input field="name" label="菜单名称" />
    </ivz-view-search>
    <ivz-view-table :columns="columns" size="small" :pagination="false" />
    <ivz-view-drawer>
      <ivz-input field="name" label="菜单名称" required/>
      <ivz-tree-select field="pid" label="父菜单" required :defaultValue="0"/>
      <ivz-input field="url" label="访问路径" required/>
      <ivz-input field="perms" label="权限标识"/>
      <ivz-select field="position" label="功能位置" dict="common_status"/>
      <ivz-select field="permType" label="功能类型" :options="permType"/>
      <ivz-input field="remark" label="备注" />
    </ivz-view-drawer>
  </ivz-func-view>
</template>

<script>
import {FunMetaMaps} from "@/utils/SysUtils";

export default {
  name: "Menu",
  setup() {
    let permType = [
      {label: '新增', value: 'Add'},
      {label: '删除', value: 'Del'},
    ]

    let position = [
      {label: '全部', value: 'AM'},
      {label: '搜索栏', value: 'M'},
      {label: '表格栏', value: 'T'},
    ];

    const columns = [
      {field: 'name', title: '菜单名称', align: 'left'},
      {field: 'url', title: '访问路径'},
      {field: 'perms', title: '权限标识'},
      {field: 'permType', title: '功能类型', options: permType},
      {field: 'position', title: '功能位置', options: position},
      {field: 'remark', title: '备注'},
      {field: 'createTime', title: '创建时间', type: 'datetime'},
      {field: 'action', title: '操作', type: 'action'},
    ]
    const editFunMetas = [
      {field: FunMetaMaps.Reset, name: '重置'},
      {field: FunMetaMaps.Submit, name: '提交'},
      {field: FunMetaMaps.Cancel, name: '取消'},
    ]
    const tableFunMetas = [
      {field: FunMetaMaps.Add, name: '新增', url: '/core/menu/add'},
      {field: FunMetaMaps.Edit, name: '编辑', url: '/core/menu/edit'},
      {field: FunMetaMaps.Del, name: '删除', url: '/core/menu/del'},
    ]
    const searchFunMetas = [
      {field: FunMetaMaps.View, name: '搜索', url: '/core/menu/view'},
      {field: FunMetaMaps.Add, name: '新增', url: '/core/menu/add'},
      {field: FunMetaMaps.Expanded, name: '展开/折叠'},
    ]
    return {columns, permType, editFunMetas, tableFunMetas, searchFunMetas}
  },
}
</script>
```

#### IvzMenuView视图
IvzMenuView组件是增删改查的另一种实现方式， 通过后台菜单配置功能点实现 如下：

```
<template>
  <ivz-menu-view :expand="true" name="菜单">
    <ivz-view-search>
      <ivz-input field="name" label="菜单名称" />
    </ivz-view-search>
    <ivz-view-table :columns="columns" size="small" :pagination="false" />
    <ivz-view-drawer>
      <ivz-input field="name" label="菜单名称" required/>
      <ivz-tree-select field="pid" label="父菜单" required :defaultValue="0"/>
      <ivz-input field="url" label="访问路径" required/>
      <ivz-input field="perms" label="权限标识"/>
      <ivz-select field="position" label="功能位置" dict="common_status"/>
      <ivz-select field="permType" label="功能类型" :options="permType"/>
      <ivz-input field="remark" label="备注" />
    </ivz-view-drawer>
  </ivz-menu-view>
</template>

<script>
export default {
  name: "Menu",
  setup() {
    let permType = [
      {label: '新增', value: 'Add'},
      {label: '删除', value: 'Del'},
    ]

    let position = [
      {label: '全部', value: 'AM'},
      {label: '搜索栏', value: 'M'},
      {label: '表格栏', value: 'T'},
    ];

    const columns = [
      {field: 'name', title: '菜单名称', align: 'left'},
      {field: 'url', title: '访问路径'},
      {field: 'perms', title: '权限标识'},
      {field: 'permType', title: '功能类型', options: permType},
      {field: 'position', title: '功能位置', options: position},
      {field: 'remark', title: '备注'},
      {field: 'createTime', title: '创建时间', type: 'datetime'},
      {field: 'action', title: '操作', type: 'action'},
    ]
    return {columns, permType}
  },
}
</script>

```

### 视图子组件
#### IvzViewSearch搜索
### antd2组件扩展
#### 增强ATable组件
#### 增强AForm组件
### 软件架构
使用vue3+antd2+vuex4+vuerouter4+moment+qs框架以及ui组件库， 没有其余的强依赖


### 安装教程

1.  xxxx
2.  xxxx
3.  xxxx

### 使用说明

1.  如果使用过程有问题欢迎pr和提交bug
2.  交流群：97235681
