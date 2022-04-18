### ivzone 一个更适合个人开发者、专业后端使用的前端框架(无需编译、可通过在线设计器直接生成页面、非前后端分离(支持), 基于Vue的传统多页面开发方式)
1. ivzone 是使用vue、antdv开发的多页面组件, 一个视图组件即一个页面(html)；一个视图组件包含了增删改查常用功能。充分发挥vue框架数据驱动视图的能力， 使得字典，select等常见组件数据获取到展示的便利性以及表格对这些组件的数据格式展示能力，最大简化了管理端前端的开发。项目采用json数据格式定义一个页面， 这使得创建一个页面只需要定义一些字段的描述性语言
2. 一个组件一个页面, 一个组件包含增删改查功能, 将增删改查的功能封装在一个组件里面, 将以前增删改查四个html页面变为一个html页面， 且共用一套元数据描述， **_此项目最大的特点就是代码极度简洁干净, 一个简单的增删改查不超过80行的代码(一个html页面)_** . 此项目只包含前端组件库, 不包含后台管理模块, 如果需要使用完整的后台管理(包含前后端, 后端使用spring boot2)请移步[izone-sboot管理后台](https://gitee.com/iteaj/izone-sboot)。
3. 学习新框架成本太高吗？ 试试使用[online可视化生成器](http://izone.iteaj.com/dev/online#/), 这是一款可以在线生成ivzone代码的生成器, 可以很直观的看到每个参数改变时ivzone代码的变化
4. 说在最后, 你们的关注和star是作者最大的动力, 如果喜欢或者能帮到你请顺手star, 同时非常欢迎PR一起维护和完善
#### [项目文档教程](https://gitee.com/iteaj/ivzone/wikis/pages) 不断更新中
#### [项目预览链接](http://izone.iteaj.com/) 用户名：admin 密码：admin123456
#### [online可视化生成器](http://izone.iteaj.com/dev/online#/) 一款可以在线学习ivzone框架和在线生成代码的可视化生成器(不断完善中 2020.08.16)
- 首先, 它是一款可视化的在线表单设计组件
- 其次, 它可以生成一个页面的完整功能, 包含增删改查以及自定义功能, 所见即所得
-  **最后, 它支持ivzone的在线学习、设计、预览** ，以及在线调试ivzone框架
- 支持mock.js的数据模拟, 预览时的数据都是通过mock模拟生成, 可以在预览页面中直接操作诸如：浏览, 新增, 删除, 修改等真实的功能
- 目前只完成默认视图, 接下去会不断更新、完善
- 这是一个初略版本, 很多功能还存在bug, 有问题可以qq联系我
#### [适用的开发者](https://gitee.com/iteaj/ivzone/wikis/%E5%85%B3%E4%BA%8Eivzone?sort_id=2409097) 列举了以下几种类型：
1. 喜欢vue的开发方式, 又不需要编译的开发者(或者不熟悉node, webpack等)
2. 对项目的界面设计没有特殊的要求, 且需要快速开发, 迭代，上线的开发者
3. 喜欢传统多页面的开发方式， 对spa(单页面)开发方式无感的开发者
4. 想找一套和后台语言无关的， 且完整包含增删改查功能(一个页级视图组件包含完整的增删改查详情等功能)的开发者
5.  _想简化编写, 通过表单的可视化拖动生成一个完整的页面_ 
#### 说明目录
1. [最新版本日志](https://gitee.com/iteaj/ivzone/wikis/%E7%89%88%E6%9C%AC%E6%9B%B4%E6%96%B0%E6%97%A5%E5%BF%97?sort_id=2131566)
2. [核心功能介绍](#核心功能说明)
3. [项目由来和介绍](#项目由来和介绍)
4. [开发语言和使用的框架](#使用语言及框架)
5. [开发和安装说明](#开发和安装说明)
6. [部分核心功能代码](#部分核心功能代码)
7. [组件界面截图](#组件界面截图)
#### 核心功能说明
1. 一个组件代表一个页面(包含增删改查、查看详情页), 其中有两种格式 1. 普通纯表单编辑 2. 表格行嵌套表单编辑
2. 支持单向绑定(使用bind())， 以及双向绑定
2. 元数据field支持嵌套写法：如对象嵌套{field: 'a.b'} 列表(数组)嵌套{field: 'a[0].b'}
3. 支持通过元数据dictType声明，直接获取字典数据(1. 在表单下拉框直接展示 2. 在表格直接显示) {dictType: 'status'}
4. 支持通过元数据url声明, 直接获取后台的数据(1. 在表单下拉框直接展示 2. 在表格直接显示) {url: '/user/list'}
5. 基于3和4的基础上， 支持在table里面直接显示以下组件对应的字段值：radio、checkbox、select、date、stree、tree
#### 在线表单设计界面预览
![主界面](https://images.gitee.com/uploads/images/2020/0821/152041_deb79857_1230742.png "设计主界面")
![多列设计](https://images.gitee.com/uploads/images/2020/0821/152858_6795cb7a_1230742.png "多列设计")
![自定义功能](https://images.gitee.com/uploads/images/2020/0821/152115_6205967d_1230742.png "自定义弹框功能")
![功能预览](https://images.gitee.com/uploads/images/2020/0821/152949_9d0bf275_1230742.png "设计后的列表页预览")
![编辑页预览](https://images.gitee.com/uploads/images/2020/0821/153220_08bc2f2b_1230742.png "设计后的编辑页预览")
![sql语句预览](https://images.gitee.com/uploads/images/2020/0821/153041_83c091c9_1230742.png "设计后的sql语句预览")
![详情页预览](https://images.gitee.com/uploads/images/2020/0821/153139_1085d653_1230742.png "详情页预览")
#### 项目由来和介绍
1. 项目的由来：提炼于开发过程中常用功能点的简化以及开发时碰到的一些痛点(繁琐、麻烦、通用)
2. 项目的目标：希望以最简单的方式, 最少的代码实现一个页面最基础的增删改查功能, 且提供灵活、强大的可扩展性
3. 项目已提供的组件：ivz-basic-view(基础列表组件+默认编辑组件+抽屉详情组件)、ivz-drawer-view(基础列表组件+抽屉编辑组件+抽屉详情组件)、ivz-edit-view(可编辑的表格页)、ivz-drawer-edit-table（可编辑的列表组件 抽屉下拉方式） 这些组件基本可以覆盖80%的业务功能
4. 已提供的页面：首页、登录页 后期将提供404、500、未授权等页面
5. 项目的特点：使用传统的前端开发方式一个功能一个页面，有别于常用的vue单页面应用, 使用此项目可以用传统的开发方式再配合vue框架提供的数据驱动、组件模块化的能力， 解决了单页面在测试的时候更新一个功能点需要重新测试其他功能点的痛苦(此项目是多页面项目, 各个功能点之间没有关联) 、以及每次新增一个功能点或者修改一个bug之后都需要重新编译、发布整个项目

#### 使用语言及框架
1. js，html，css 前端标准语言
2. vue、axios、qs、mockjs 等前端框架
3. antdv组件库

#### 开发和安装说明
测试环境
1. 使用ide开发工具克隆源代码 或者使用git命令：git clone https://gitee.com/iteaj/ivzone.git
2. 安装依赖：npm install
3. 启动项目, 默认端口是8080, 
  <br> 开发测试环境直接访问：http://localhost:8080/index.html 
  <br> 正式环境 暂时请使用izone-sboot后台脚手架开发[sboot管理后台](https://gitee.com/iteaj/izone-sboot)

#### 部分核心功能代码
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


#### 组件界面截图
以下是系统的一些页面展示, 以及对应的代码，以菜单页为例(使用<ivz-basic-view>组件)
菜单管理列表页
![菜单列表页](https://images.gitee.com/uploads/images/2020/0515/183358_254d766a_1230742.png "{QB3L9QVP%6THQD[)WA}$ZM.png")

#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request