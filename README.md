### ivzone是一套基于vue3+vite2+antdv2+js实现的后台管理模板
1. 它颠覆对增删改查模板的开发体验和使用方式,基于vite2.0+vue3.0+antdv2+vuex4.0+vuerouter4最新技术，具有实现优雅、代码简洁、通俗易懂、开发效率高、代码量少等优点(核心思想：为通用操作提供一个默认的实现，并实现各组件之间的联动，只做增强不做限制)
2. 提供一套后台管理常用功能模板(用户，角色，菜单，字典，机构，配置等)的实现
3.  _优雅、好用、与众不同、易理解(请自行体验，交流群：616124620)_ 
4. [项目预览地址](http://demo.iteaj.com/) 以及配套的 [java后端项目](https://gitee.com/iteaj/izone-sboot)
#### 简洁的写法
```
<template>
  <IvzBasicView> // 基础视图页面
    <IvzViewSearch> // 基础搜索组件
      <IvzInput field="name" label="茶叶名称"/>
      <template #func>
        <IvzFuncBtn func='view' url='/product/list'>查询</IvzFuncBtn>&nbsp;
        <IvzFuncBtn func="add" url='/product/add'>新增</IvzFuncBtn>
      </template>
    </IvzBasicSearch> // 基础表组件
    <IvzViewTable :bordered="true" :columns="columns" :dataSource="dataSource" rowKey="id">
      <template #c_action="{record}">
        <IvzFuncTag func='edit' url='/product/edit'>修改</IvzFuncTag>
        <IvzFuncTag func="del" url='/product/del'>删除</IvzFuncTag>
      </template>
    </IvzBasicTable>
    <IvzViewModal>// 基础模态框编辑组件
      <IvzInput field="name" label="茶叶名称"/>
      <template #title="{model}">
        {{model.id ? '编辑产品' : '新增产品'}}
      </template>
      <template #footer>
        <IvzFuncBtn func='cancel'>取消</IvzFuncBtn>
        <IvzFuncBtn func='submit' url='/product/add'>提交</IvzFuncBtn>
        <IvzFuncBtn func='reset'>重置</IvzFuncBtn>
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
  }
}
</script>
```
####  **核心思想** 
##### 约定大于配置
1. 约定一个功能页面包含大于0 的增删改查组件，并将组件划分和关联
2. 约定每个页面可能包含 增、删、改、查、导入、导出、删除、重置、取消、展开、提交的某几个功能
3. 约定通用功能的实现逻辑具有通用性(比如提交表单的逻辑是先校验表单然后提交到后台，如果提交失败提示失败信息，如果成功关闭编辑框并且刷新列表) 
4. 约定某些组件的层级关系, 比如组件IvzBasicTable必须作为IvzBasicView的子组件, 且IvzBasicView必须做顶级组件
##### 灵活(只做增强不做限制)
1. api灵活：除了使用默认已经实现的api外，所有的功能都可以按照往常的方式开发
2. 布局灵活：可以对组件实现任意布局, 不会因为通用功能的存在而丧失布局的灵活性

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

### 使用教程
#### 功能组件
1. 功能组件主要是用来拓展和简化功能的操作方式, 使用功能组件将提供一套默认的操作功能
2. 提供的功能包括[add, del, edit, query, import, export, reset, cancel, submit, expand]以及混合联动操作
##### IvzFuncBtn
功能按钮：用在搜索组件和编辑组件
```
<IvzBasicView>
    <IvzViewSearch>
        <template #func={model}>
            <IvzFuncBtn func='add'>新增</IvzFuncBtn> // 点击默认动作：将打开一个编辑框(IvzViewModal or IvzViewDrawer)
            <IvzFuncBtn func='query' url="/project/query">搜索</IvzFuncBtn> // 点击默认动作：重新刷新列表
            <IvzFuncBtn func='reset'>重置</IvzFuncBtn> // 点击默认动作：重置搜索表单, 并且重新刷新列表(和表格组件联动)
        </template>
    </IvzViewSearch>
    <IvzViewModal>
       <template #footer={model}>
          <IvzFuncBtn func='cancel'>取消</IvzFuncBtn> // 点击默认动作：关闭当前编辑框, 关闭提交动画关闭提交按钮动作
          // 点击默认动作：校验表单是否通过, 然后提交表单, 开启表单的提交动画, 开启提交按钮的提交动画(防止多次提交) 
          <IvzFuncBtn func='submit' :url="model.id ? '/project/edit':'/project/add'">提交</IvzFuncBtn> 
          <IvzFuncBtn func='reset'>重置</IvzFuncBtn> // 点击默认动作：重置编辑表单
       </tempalte>
    </IvzViewSearch>
</IvzBasicView>
```
##### IvzFuncTag
功能tag：用于表格操作
```
<IvzBasicView rowKey="id">
    <IvzViewTable>
        <template #c_action={record}>
            // 点击默认动作：打开编辑框, 并获取和渲染url对应的数据
            <IvzFuncBtn func='edit' :data="record" url="/project/edit">编辑</IvzFuncBtn> 
             // 点击默认动作：弹出删除确认框, 确定之后调用url对应的接口删除数据, 提交的参数是数组格式：[record[rowKey]]
            <IvzFuncBtn func='del' :data="record" url="/project/del">删除</IvzFuncBtn>
        </template>
    </IvzViewSearch>
</IvzBasicView>
```
##### 误操作确认
有时候为了防止某些功能的误操作，将会在点击功能的时候弹框确认, 这时候可以使用：confirm属性
```
<IvzFuncBtn func='demo' :data="record" url="/project/demo" confirm>容易误操作</IvzFuncBtn>
```

##### 与编辑框联动
主要用于点击功能按钮时弹出对应的编辑框
1. 打开其他的编辑框
```
<IvzBasicView rowKey="id">
    <IvzViewTable>
        <template #c_action={record}>
            // 默认动作：打开id="modPwd"的编辑框, 并且设置编辑框: model[rowKey]=record[rowKey]
            <IvzFuncBtn func='edit:modPwd' :data="record">修改密码</IvzFuncBtn> 
        </template>
    </IvzViewSearch>
    // 修改密码编辑框
    <IvzBasicModal id="modPwd" :rules="[自定义校验规则]">
       <IvzPassword label="密码" field="password" />
       <template #footer={model}>
          <IvzFuncBtn func='cancel'>取消</IvzFuncBtn> // 点击默认动作：关闭当前编辑框, 关闭提交动画关闭提交按钮动作
          // 默认动作：校验表单, 然后提交表单, 开启表单的提交动画, 开启提交按钮的提交动画(防止多次提交) 
          <IvzFuncBtn func='submit' :url="model.id ? '/project/edit':'/project/add'">提交</IvzFuncBtn> 
          <IvzFuncBtn func='reset'>重置</IvzFuncBtn> // 点击默认动作：重置编辑表单
       </tempalte>
    </IvzBasicSearch>
</IvzBasicView>
```
2. 新增子记录(树形结构格式)
```
<IvzBasicView rowKey="id">
    <IvzViewTable>
        <template #c_action={record}>
            // 打开新增的编辑框, 并且设置编辑框父id: model[pid]=record[rowKey]
            <IvzFuncBtn func='add:child' :data="record">新增子菜单</IvzFuncBtn> 
        </template>
    </IvzViewSearch>
</IvzBasicView>
```

#### 功能权限
功能权限主要是用来控制页面是否需要显示对应的功能
##### v-auth指令
// 后台使用shiro做权限校验
```
// 基础用法
// 存在权限字符串就显示
<AButton v-auth="'core:project:add'">新增</ABtton>

// 高级用法
// and参数, 必须满足数组里面的两个权限
<AButton v-auth:and="['core:project:view', 'core:project:info']">详情</ABtton>
// or参数, 只需满足数组里面的两个权限的任何一个
<AButton v-auth:or="['core:project:view', 'core:project:info']">详情</ABtton>
// and的简写
<AButton v-auth="['core:project:view', 'core:project:info']">详情</ABtton>
```
##### 使用url做权限判断
url的控制方式是通过后台是否有返回功能组件[IvzFuncBtn or IvzFuncTag]对应的url

```
// 使用auth属性控制权限校验的开关
// 比如回台返回的功能菜单包括 新增(/project/add)、编辑(/project/edit)、搜索(/project/query)
<IvzBasicView auth>
    <IvzViewSearch>
        <template #func>
            <IvzFuncBtn func='add' url='/project/add'>新增</IvzFuncBtn> // 显示
            <IvzFuncBtn func='import' url='/project/import'>导入</IvzFuncBtn> // 不显示
        </template>
    </IvzViewSearch>
    <IvzViewTable>
        <template #c_action={record}>
            <IvzFuncTag func='edit' url='/project/edit' :data="record">修改</IvzFuncTag > // 显示
            <IvzFuncTag func='del' url='/project/del' :data="record">删除</IvzFuncTag > // 不显示
        </template>
    </IvzViewSearch>
</IvzBasicView>
```
##### 编辑详情url
```
// 此处的url是获取编辑详情数据的url，但是并没有指定参数，也无需指定参数
<IvzFuncTag func='edit' url='/project/edit' :data="record">修改</IvzFuncTag >
// 默认获取编辑地址url的方法如下：Context.js
this.getEditUrl = function (model, editContext) {
    let rowKey = this.getRowKey();
    let editFunc = this.getTableFunc(FuncNameMeta.EDIT);
    if(editFunc && model) {
        return `${editFunc.getUrl()}?${rowKey}=${model[rowKey]}`;
    } else {
        console.warn('未指定编辑功能获取详情数据地址')
        return null;
    }
}
// 如果以上方法不能满足你获取url，可以在mount钩子里面覆盖掉此方法，重写
```
#### 视图组件
视图组件是用来组织视图子组件的容器且必须作为.vue页面的顶级组件。再此容器内支持对所有的可联动的视图子组件做联动操作：比如点击搜索组件的查询按钮表格组件将发起查询接口获
##### IvzBasicView
```
<template>
   <IvzBasicView>
       ...
   </IvzBasicView>
</template>
<script>...</script>
```
 **使用url作为权限控制** 
```
<IvzBasicView auth>...</IvzBasicView>
```
 **指定功能的唯一键** 
```
<IvzBasicView rowKey="id">...</IvzBasicView>
// 此属性将用来做表格、编辑与新增、新增子记录的判断
```
#### 视图子组件
1. 以下的所有组件都只能用在页级组件(IvzBasicView、IvzMenuView)的子组件，组成一个完整的功能页面
2. IvzViewModal、IvzVieDrawer、IvzViewTable视图组件只做功能增加，可以使用原生组件的任何属性, 少数不能用的属性会做说明
##### IvzViewSearch
1. 支持[AForm](https://2x.antdv.com/components/form-cn)的所有属性
2. 属于页面可联动的搜索组件
##### IvzViewModal
1. 支持[AForm组件](https://2x.antdv.com/components/form-cn)的所有属性
2. 支持[AModal组件](https://2x.antdv.com/components/modal-cn)的所有属性
3. 新增属性[span] 作为AForm组件的labelCol和wrapperCol的简写， 格式 [6, 18]
4. 属于页面可联动的编辑组件
##### IvzViewDrawer
1. 支持[AForm](https://2x.antdv.com/components/form-cn)的所有属性
2. 支持[ADrawerl](https://2x.antdv.com/components/drawer-cn)的所有属性
3. 新增属性[span] 作为AForm组件的labelCol和wrapperCol的简写， 格式 [6, 18]
4. 属于页面可联动编辑组件
##### IvzViewTable
1. 支持[ATable](https://2x.antdv.com/components/table-cn)的所有属性
##### IvzBasicModal
1. 支持[AForm组件](https://2x.antdv.com/components/form-cn)的所有属性
2. 支持[AModal组件](https://2x.antdv.com/components/modal-cn)的所有属性
3. 新增属性[primary] 用来声明此组件是可联动的组件
##### IvzBasicDrawer
1. 支持[AForm](https://2x.antdv.com/components/form-cn)的所有属性
2. 支持[ADrawerl](https://2x.antdv.com/components/drawer-cn)的所有属性
3. 新增属性[primary] 用来声明此组件是可联动的组件
### antd2组件扩展
##### <a href="https://2x.antdv.com/components/table-cn#API" target="_blank">增强ATable组件</a>
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
2. 其他的属性全部支持
##### 自定义列slot
```
// columns列不支持customRender， 通过slot方式提供
// 展示通过slot实现自定义此列
const columns = [
  {field: 'name', title: '菜单名称', align: 'left'}，
  {field: 'user.name', title: '用户名称', align: 'left'}
]

// 插槽名称规则：前缀 c_ + 字段名 = c_name
// 如果是a.b的格式将'.'换成'_'即：c_a_b
<IvzBasicTable rowKey="id">
    <template #c_name="{record}">
        <a>{{record.name}}</a>
    </template>
    <template #c_user_name="{record}">
        <a>{{record.user.name}}</a>
    </template>
</IvzBasicTable>
```
##### 字典和url
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
### 安装教程
1. 安装[node](https://nodejs.org/zh-cn/) >= 12.0.0。
2. 安装[vite2](https://cn.vitejs.dev/)
```
npm init vite@latest
```
3. clone项目或者使用ide直接导入
```
git clone https://gitee.com/iteaj/ivzone.git
```

### 使用说明

1.  如果使用过程有问题欢迎pr和提交bug
2.  交流群：97235681
