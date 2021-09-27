# ivzone
一个组件一个页面, 一个组件包含增删改查功能, 将增删改查的功能封装在一个组件里面, 将以前增删改查四个html页面变为一个html页面， 且共用一套元数据描述， 此项目只包含前端组件库, 不包含后台管理模块, 如果需要使用完整的后台管理(包含前后端, 后端使用spring boot2)请移步[izone-sboot管理后台](https://gitee.com/iteaj/izone-sboot)

#### 最新版本更新日志 (1.1.1)
1. 新增tree组件到表单域, 通过类型type='tree'
2. 修改表格读取组件radio、checkbox、stree、tree、date、select数据的方式

##### [历史版本更新日志](https://gitee.com/iteaj/ivzone/wikis/%E7%89%88%E6%9C%AC%E6%9B%B4%E6%96%B0%E6%97%A5%E5%BF%97?sort_id=2131566)
#### 最核心功能说明
1. 一个组件代表一个页面(包含增删改查、查看详情页), 其中有两种格式 1. 普通纯表单编辑 2. 表格行嵌套表单编辑
2. 支持单向绑定(使用bind())， 以及双向绑定
2. 元数据field支持嵌套写法：如对象嵌套{field: 'a.b'} 列表(数组)嵌套{field: 'a[0].b'}
3. 支持通过元数据dictType声明，直接获取字典数据(1. 在表单下拉框直接展示 2. 在表格直接显示) {dictType: 'status'}
4. 支持通过元数据url声明, 直接获取后台的数据(1. 在表单下拉框直接展示 2. 在表格直接显示) {url: '/user/list'}
5. 基于3和4的基础上， 支持在table里面直接显示以下组件对应的字段值：radio、checkbox、select、date、stree、tree

#### 介绍
1. 项目的由来：提炼于开发过程中常用功能点的简化以及开发时碰到的一些痛点(繁琐、麻烦、通用)
2. 项目的目标：希望以最简单的方式, 最少的代码实现一个页面最基础的增删改查功能, 且提供灵活、强大的可扩展性
3. 项目已提供的组件：ivz-basic-view(基础列表组件+默认编辑组件+抽屉详情组件)、ivz-drawer-view(基础列表组件+抽屉编辑组件+抽屉详情组件)、ivz-edit-view(可编辑的表格页)、ivz-drawer-edit-table（可编辑的列表组件 抽屉下拉方式） 这些组件基本可以覆盖80%的业务功能
4. 已提供的页面：首页、登录页 后期将提供404、500、未授权等页面
5. 项目的特点：使用传统的前端开发方式一个功能一个页面，有别于常用的vue单页面应用, 使用此项目可以用传统的开发方式再配合vue框架提供的数据驱动、组件模块化的能力， 解决了单页面在测试的时候更新一个功能点需要重新测试其他功能点的痛苦(此项目是多页面项目, 各个功能点之间没有关联) 、以及每次新增一个功能点或者修改一个bug之后都需要重新编译、发布整个项目

#### 使用语言及框架
1. js，html，css 前端标准语言
2. vue、axios、qs、mockjs 等前端框架
3. antdv组件库

#### 使用说明
测试环境
1. 使用ide开发工具克隆源代码 或者使用git命令：git clone https://gitee.com/iteaj/ivzone.git
2. 安装依赖：npm install
3. 启动项目, 默认端口是8080, 访问测试环境页面：http://localhost:8080/index.html
正式环境 暂时请使用izone-sboot后台脚手架[sboot管理后台](https://gitee.com/iteaj/izone-sboot)

#### 使用说明
下面通过一些简短的代码片段说明一些开发中常用的功能
核心功能
###### 一对一关系
```
{field: 'dept.name', title: '部门名称', dictType: 'user_dept', type: 'select'}
```
###### 一对多关系
```
{field: 'role[0].name', title: '角色名称', url: '/admin/role/tree', type: 'stree'}
```

1. 引用字典数据到下拉框

```
{field: 'status', title: '订单状态', dictType: 'pay_status', type: 'select', width: 80}
```
2. 时间格式化

```
{field: 'createTime', title: '创建时间', type: 'date', config: {
                        format: 'YYYY-MM-DD'
                    }
                }
```
3. 自定义表单验证

```
{field: 'account', title: '帐号', placeholder: '帐号只能是手机号或邮箱', required: true
                    , validator: function (rule, val, callback) {
                    if(!email(val) && !phone(val)){
                        callback(new Error('账号只能是手机号或邮箱'));
                    } else {
                        callback();
                    }
             }},
```
4. 树类型下拉选择框

```
{field: 'pid', title: '父级代理', isTable: false, type: 'stree', url: '/pay/agent/stree'}
```
5. 自定义插槽用法
表单项slot：

```
<ivz-basic-view ref="vbt" :metas="mates" :config="config" :search-metas="searchMetas">
    <template #perm_type_f="params">
        <a-input v-decorator="[params.meta.field, params.meta['decorate']]"
                 :disabled="params.meta.disabled">
            <a-select slot="addonAfter" :options="PermTypeOptions"
                style="width: 88px" :value="typeValue" :disabled="typeDisabled"
                @change="permTypeHandler"></a-select>
        </a-input>
    </template>
</ivz-basic-view>
```
表格列slot
```
<ivz-basic-view ref="vbt" :metas="mates" :config="config" :search-metas="searchMetas">
    <template #status_t="{row, index, meta}">
        <span>{{row.status}}</span>
    </template>
</ivz-basic-view>
```


#### 组件界面截图以及代码实现
以下是系统的一些页面展示, 以及对应的代码，以菜单页为例(使用<ivz-basic-view>组件)
菜单管理列表页
![菜单列表页](https://images.gitee.com/uploads/images/2020/0414/191721_edecbc42_1230742.jpeg "1586862411(1).jpg")
菜单管理编辑页
![菜单编辑页面](https://images.gitee.com/uploads/images/2020/0414/191936_2f45126b_1230742.jpeg "编辑菜单页面.jpg")

字典列表页（使用 Ivz-eidt-view 组件）
![字典页面](https://images.gitee.com/uploads/images/2020/0414/193119_e978ad4a_1230742.jpeg "字典列表.jpg")

字典数据抽屉列表(使用 ivz-drawer-edit-table 组件)
![字典数据](https://images.gitee.com/uploads/images/2020/0414/193229_f189b924_1230742.jpeg "字典数据.jpg")

抽屉编辑页
![配置页面](https://images.gitee.com/uploads/images/2020/0414/202611_6cdee6fb_1230742.jpeg "配置页面.jpg")

#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request
