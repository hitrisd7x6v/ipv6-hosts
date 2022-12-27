### ivzone是一套基于vue3+antdv2实现的通用增删改查组件库([预览地址 _【数据全部用mock模拟】_ ](http://ivzone.iteaj.com/#/)) 
它颠覆对增删改查模板的开发体验和使用方式,基于vite2.0+vue3.0+antdv2+vuex4.0+vuerouter4最新技术，具有实现优雅、代码简洁、通俗易懂、开发效率高、代码量减少30%+等优点(核心思想：为通用操作提供一个默认的实现，并实现各组件之间的联动)，并提供一套后台管理常用功能模板(用户，角色，菜单，字典，机构，配置等)的实现（ _**相信会爱上它的**_ ）

#### 如何优雅、简洁、灵活的实现一个通用的增删改查功能
```
<template>
  <IvzBasicView>
    <IvzBasicSearch primary>
      <IvzInput field="name" label="茶叶名称"/>
      <AButton type="primary" @click="query">查询</AButton>&nbsp;
      <AButton @click="add">新增</AButton>
    </IvzBasicSearch>
    <IvzBasicTable primary :bordered="true" :columns="columns" :dataSource="dataSource" rowKey="id">
      <template #c_action="{record}">
        <ATag color="blue" @click="add">新增</ATag>
        <ATag color="red" @click="() => del(record)">删除</ATag>
      </template>
    </IvzBasicTable>
    <IvzBasicModal primary>
      <IvzInput field="name" label="茶叶名称"/>
      <template #title="{model}">
        {{model.id ? '编辑产品' : '新增产品'}}
      </template>
    </IvzBasicModal>
  </IvzBasicView>
</template>

<script>
export default {
  name: "Demo",
  setup() {
    let columns = [
      {field: 'name', title: '产品名称'},
      {field: 'type', title: '产品类型'},
      {field: 'action', type:'action', title: '操作'},
    ]
    let dataSource = [
      {id: 1, name: '清香秋茶', type: '清香型'}
    ]
    return {columns, dataSource}
  },
  methods: {
    add() {
      this.$view.openForAdd(); // 打开一个新增的模态框
    },
    del(row) {
      this.$view.del('/product/del', [row.id]); // 删除某一行
    },
    query() {
      this.$view.query('/product/list'); // 查询列表
    }
  }
}
</script>
```

####  **核心思想** 
1. 约定大于配置
2. 组件高内聚
3. 重用inject和provide
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
![输入图片说明](https://images.gitee.com/uploads/images/2021/0603/201308_9df49df1_1230742.png "1622722329(1).png")
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
// 后台返回的菜单列表
// {id: 158, name: '菜单管理', url: '/core/menu', pid: 11, type: 'V', children: [
//       {name: '新增', permType: 'Add', type: 'A', sort: 30, position: 'M', url: '/core/menu/add'},
//       {name: '搜索', permType: 'View', type: 'A', sort: 10, position: 'M', url: '/core/menu/view'},
//       {name: '编辑', permType: 'Edit', type: 'A', sort: 50, position: 'T', url: '/core/menu/edit'},
//       {name: '删除', permType: 'Del', type: 'A', sort: 80, position: 'T', url: '/core/menu/del'},
//   ]
//}
```

### 视图子组件
#### IvzViewSearch 搜索组件
#### IvzViewModal 模态框编辑组件
#### IvzViewDrawer 抽屉编辑组件
#### IvzViewTable 表格组件
### antd2组件扩展
#### <a href="https://2x.antdv.com/components/table-cn#API" target="_blank">增强ATable组件</a>
antd的表格组件说实话如果没有去认证研究和实践真的很难看得懂，而且很多功能都要自己实现，比如单击和双击、表格和多选等等， 没有一定的使用经验确实会感觉难用，所以提供了IvzBaiscTable表格增强组件。IvzBasicTable组件支持ATable组件的大部分属性，下面主要看一下不支持的属性和增强的功能
##### 1.不支持的属性
1. rowSelection 此属性是ATable用来描述表格多选框的一个对象，在IvzBasicTable组件里面此对象直接放到columns属性里面，像这样：

```
const columns = [
 // 支持rowSelection里面的多数属性
 //  type不支持 默认：checkbox，不支持radio
  {type: 'selection', title: '多选'},
  {field: 'name', title: '菜单名称', align: 'left'}
]
// onChange、onSelect、onSelectAll、onSelectInvert方法将直接支持在IvzBasicTable组件上使用事件
<IvzBasicTable ref="tableRef" @selectChange="xx" @select="xx" @selectAll="xx" @selectInvert="xx"></IvzBasicTable>
// selectedRowKeys 不支持， 通过方法提供
this.$refs['tableRef'].getSelectedRowKeys();
```
2. pagination不支持使用对象 只能使用true或者false

```
// true 显示分页， false不显示分页
<IvzBasicTable :pagination="true"></IvzBasicTable>
// 分页的配置项直接通过props属性
<IvzBasicTable :pagination="true" :showTotal="true" :showQuickJumper="true" :showSizeChanger="true"/>
3. 其他的属性全部支持
```
##### 2.自定义列slot
```
// columns列不支持customRender， 通过slot方式提供
// 展示通过slot实现自定义此列
const columns = [
  {field: 'name', title: '菜单名称', align: 'left'}，
  {field: 'user.name', title: '用户名称', align: 'left'}
]

// 插槽名称规则：前缀 c_ + 字段名 = c_name
// 如果是a.b的格式将'.'换成'_'即：c_a_b
<IvzBasicTable :pagination="true">
    <template #c_name="{record}">
        <a>{{record.name}}</a>
    </template>
    <template #c_user_name="{record}">
        <a>{{record.user.name}}</a>
    </template>
</IvzBasicTable>
```
##### 3.字典和url
支持将value转成label 比如性别字段：数据库存的是值：man，表格需要展示：男

```
// 通过本地变量sex
const sex = [
    {label: '男', value: 'man'},{label: '女', value: 'woman'}
]
const columns = [
    {field: 'sex', title: '性别', options: sex}
]
// 通过字典， 提供的字典类型sex，必须可以返回options格式相同的数组
const columns = [
    {field: 'sex', title: '性别', dict: 'sex'}
]
// 通过url, 提供的url必须可以返回options格式相同的数组
const columns = [
    {field: 'sex', title: '性别', url: '/core/getSex'}
]
```
##### 4.日期格式化
如果是日期列，会默认将日期进行安装指定的格式进行格式化，可以用默认格式也可以自定义格式

```
// 通过指定type='datetime'
const columns = [
    {field: 'createTime', title: '创建时间', type: 'datetime'}
]
// 默认格式 {datetime: 'YYYY-MM-DD HH:mm:ss', date: 'YYYY-MM-DD', month: 'MM', week: 'E', time: 'HH:mm:ss'}
// 通过picker指定具体类型，不指定则默认使用datetime格式
const columns = [
    {field: 'createTime', title: '创建时间', type: 'datetime', picker: 'month'}
]
```
##### 5.操作列
IvzBasicTable组件支持使用两种方式定义操作列
第一 使用功能点列表

```
// 使用type="action"声明此列是操作列
const columns = [
    {field: 'action', title: '操作', type: 'action', funMetas: [
            {field:'Edit', '编辑',props: {onClick: (row) => {}}}， {field:'Del', '删除', props: {onClick: (row) => {}}}
        ]
    }
]
```
第二 使用自定义slot
```
// template
<template #c_action={record, column}>
    <a-button>编辑</a-button>
    <a-button>修改</a-button>
</template>

// js
const columns = [
    {field: 'action', title: '操作', type: 'action'}
]
```
##### 6.数据格式化
除了上面的自定义slot，日期格式化，字典url，IvzBasicTable组件还支持自定义格式化数据

```
const columns = [
    {field: 'createTime', title: '创建时间', formatter: ({value,record,column}) => value}
]
```

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
