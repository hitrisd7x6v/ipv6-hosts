# ivzone
一个组件一个页面, 一个组件包含增删改查功能, 将增删改查的功能封装在一个组件里面, 将以前增删改查四个html页面变为一个html页面， 且共用一套元数据描述， 此项目只包含前端组件库, 不包含后台管理模块, 如果需要使用完整的后台管理(包含前后端, 后端使用java spring boot2)请移步[管理后台](https://gitee.com/iteaj/izone-sboot)

#### 介绍
1. 项目的由来：提炼于开发过程中常用功能点的简化以及开发时碰到的一些痛点(繁琐、麻烦、通用)
2. 项目的目标：希望以最简单的方式, 最少的代码实现一个页面最基础的增删改查功能, 且提供灵活、强大的可扩展性
3. 项目已提供的组件：ivz-basic-view(基础列表组件+默认编辑组件+抽屉详情组件)、ivz-drawer-view(基础列表组件+抽屉编辑组件+抽屉详情组件)、ivz-edit-view(可编辑的表格页)、ivz-drawer-edit-table（可编辑的列表组件 抽屉下拉方式） 这些组件基本可以覆盖80%的业务功能
4. 已提供的页面：首页、登录页 后期将提供404、500、未授权等页面
5. 项目的特点：使用传统的前端开发方式一个功能一个页面，有别于常用的vue单页面应用, 使用此项目可以用传统的开发方式再配合vue框架提供的数据驱动、组件模块化的能力， 解决了单页面在测试的时候更新一个功能点需要重新测试其他功能点的痛苦(此项目是多页面项目, 各个功能点之间没有关联) 、以及每次新增一个功能点或者修改一个bug之后都需要重新编译、发布整个项目

#### 组件界面截图以及代码实现
以下是系统的一些页面展示, 以及对应的代码，以菜单页为例(使用<ivz-basic-view>组件)
菜单管理列表页
![菜单列表页](https://images.gitee.com/uploads/images/2020/0414/191721_edecbc42_1230742.jpeg "1586862411(1).jpg")
菜单管理编辑页
![菜单编辑页面](https://images.gitee.com/uploads/images/2020/0414/191936_2f45126b_1230742.jpeg "编辑菜单页面.jpg")
实现菜单页增删改查的代码
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
<script>
    let MenuTypeOptions = [
        {label: '菜单', value: 'M'},
        {label: '视图', value: 'V'},
        {label: '权限', value: 'A'},
    ];
    let PermTypeOptions = [
        {label: '自定义', value: 'Customer'},
        {label: '浏览', value: 'View'},
        {label: '新增', value: 'Add'},
        {label: '删除', value: 'Del'},
        {label: '修改', value: 'Edit'},
        {label: '导入', value: 'Import'},
        {label: '导出', value: 'Export'},
    ];
    let PositionOptions = [
        {label: '主栏', value: 'M'},
        {label: '主栏(更多)', value: 'MM'},
        {label: '表栏', value: 'T'},
        {label: '表栏(更多)', value: 'TM'},
        {label: '主、表栏', value: 'AM'},
    ];
  let vue = new Vue({
      el: "#MenuComponent",
      data: {
          permtype: 'permType',
          typeValue: 'Customer',
          typeDisabled: false,
          mates: [
              {field: 'basic', title: '基础信息', metas: [
                      {field: 'name', title: '菜单名称', align: 'left'
                          , width: 168, required: true, fixed: 'left'},
                      {field: 'pid', title: '父菜单', type: 'stree', url: '/core/menu/parent'
                          , isTable: false, config: {
                              showSearch: true,
                              dropdownStyle: {
                                  maxHeight: '200px'
                              }
                          }},
                      {field: 'msn', title: '所属模块', required: true}
                  ]},
              {field: 'menu', title: '菜单信息', metas: [
                      {field: 'type', title: '菜单类型', type: 'select', required: true
                          , data: MenuTypeOptions, width: 80, event: {
                              change: function(menuType, args) {
                                  if(menuType == 'V') {
                                      args.bind({permType: 'View'});
                                      vue.typeValue = 'View';
                                      vue.typeDisabled = true;
                                      vue.$page.getMeta('position').disabled = true;
                                      vue.$page.getMeta('permType').disabled = true;
                                  } else if(menuType == 'M') {
                                      args.bind({permType: ''});
                                      vue.typeValue = 'Customer';
                                      vue.typeDisabled = true;
                                      vue.$page.getMeta('position').disabled = true;
                                      vue.$page.getMeta('permType').disabled = true
                                  } else {
                                      vue.typeDisabled = false;
                                      args.bind({permType: ''});
                                      vue.typeValue = 'Customer';
                                      vue.$page.getMeta('position').disabled = false;
                                      vue.$page.getMeta('permType').disabled = false
                                  }
                              }
                          }
                      },
                      {field: 'url', title: '功能链接', width: 280, required: false, event: {
                              change: function (val, args) {
                                  vue.fuzzyMatch(val, args.model);
                              }
                          }},
                      {field: 'perms', title: '权限标识', event: {
                              change: function (val, args) {
                                  vue.fuzzyMatch(val, args.model);
                              }
                          }},
                      {field: 'permType', alias: 'permtype', title: '权限类型', disabled: false, event: {
                              change: function (val, args) {
                                  if(val == 'View' && args.model['type'] != 'V') {
                                      vue.$page.bind({position: 'M'});
                                  }
                              }
                          }},
                      {field: 'position', title: '功能位置', type: 'select', disabled: false
                          , data: PositionOptions
                      },
                      {field: 'status', title: '状态', type: 'radio', data: [
                              {label: '显示', value: 'view'}
                              , {label: '隐藏', value: 'hide'}
                              , {label: '禁用', value: 'disabled'}
                          ], default: 'view', width: 64},
                  ]},
              {field: 'other', title: '其他信息', metas: [
                      {field: 'icon', title: '图标', width: 160},
                      {field: 'remark', title: '备注', width: 120},
                      {field: 'sort', title: '排序', fixed: 'right', width: 60, type: 'number'}
                  ]},
              {field: 'action', title: '操作', type: 'action', width: 300, fixed: 'right'},
          ],
          searchMetas: [
              {field: 'name', title: '菜单名称'},
              {field: 'permType', title: '权限类型', type: 'select', data: PermTypeOptions, clear: true}
          ],
          actionMetas: null,
          config: {
              form: {
                  type: 'group'
              },
              table: {

              }
          },
      },
      created: function() {
          this.actionMetas = this.$page.getActionMetas();
          let addMeta = this.actionMetas['Add'];
          let editMeta = this.actionMetas['Edit'];
          let disabled = !(addMeta || editMeta); // 有编辑和新增的权限就不需要禁用否则禁用

          this.$page.addActionMeta('Auth', {id: 'auth', label: '生成权限', color: 'green', url: '/core/menu/auth'
              ,position: 'T', callBack: function(row) {
                  return new Promise(function(resolve, reject) {
                      return resolve({
                          tipTitle: '确认生成视图['+row['name']+']的默认权限吗？',
                          tipContent: '此动作会默认生成增、删、改、查功能点'
                      });
                  })
              }, disabled: function(row) {
                  return disabled || (row['type'] != 'V' || (row['type'] === 'V' && vue.isNotBlank(row['children'])));
              }
          });
          this.$page.setActionMeta('Del', {callBack: function(model) {
              return new Promise(function(resolve, reject) {
                  if(vue.isNotBlank(model['children'])) {
                      vue.$msg.warningMessage('请先删除子级菜单');
                      return reject();
                  }
                  return resolve();
              })
          }});
      },
      methods: {
          menuTypeHandler: function(menuType, model) {

          },
          /**
           * 模糊設置
           * @param val
           */
          fuzzyMatch: function(val, model) {
              if(model['type'] == 'A') {
                  if(val.indexOf('add') != -1) {
                      this.permTypeHandler('Add');
                  } else if(val.indexOf('edit') != -1) {
                      this.permTypeHandler('Edit');
                  }
              }
          },
          permTypeHandler: function(val) {
              this.typeValue = val;
              if(val !== 'Customer') {
                  this.$page.bind({permType: val});
                  vue.$page.getMeta('permType').disabled = true;
              } else {
                  this.$page.bind({permType: null});
                  vue.$page.getMeta('permType').disabled = false;
              }
          },
      }
  });
</script>

```
字典列表页（使用 Ivz-eidt-view 组件）
![字典页面](https://images.gitee.com/uploads/images/2020/0414/193119_e978ad4a_1230742.jpeg "字典列表.jpg")
字典数据抽屉列表(使用 ivz-drawer-edit-table 组件)
![字典数据](https://images.gitee.com/uploads/images/2020/0414/193229_f189b924_1230742.jpeg "字典数据.jpg")
代码：

```
<!DOCTYPE html>
<html lang="en">
<head>
    <th:block th:include="libs :: header('字典管理')"></th:block>
</head>
<body>
  <div id="DictComponent">
    <ivz-edit-view ref="vbt" :metas="metas" :config="config" :search-metas="searchMetas"></ivz-edit-view>
    <ivz-drawer-edit-table :metas="dictData.metas" :action-metas="dictData.actionMetas"
        :config="dictData.config" ref="det" :height="300"></ivz-drawer-edit-table>
  </div>
  <th:block th:include="libs :: footer"></th:block>
</body>
<script>
  let vue = new Vue({
      el: "#DictComponent",
      data: {
          editRow: null,
          metas: [
              {field: 'name', title: '字典名称', width: 180, required: true, editable: true},
              {field: 'type', title: '字典类型', required: true, editable: true},
              {field: 'status', title: '状态', type: 'select', data: [
                      {label: '启用', value: '正常'}, {label: '禁用', value: '禁用'}
                  ], default: '正常', editable: true, width: 180},
              {field: 'remark', title: '备注', width: 280, editable: true},
              {field: 'createTime', title: '创建时间', width: 160, type: 'date', isForm: false},
              {field: 'action', title: '操作', type: 'action'},
          ],
          searchMetas: [
              {field: 'status', title: '状态', type: 'select', data: [
                      {label: '启用', value: '正常'}, {label: '禁用', value: '禁用'}
                  ]},
          ],
          dictData: {
              metas: [
                  {field: 'type', title: '字典类型', width: 120},
                  {field: 'label', title: '标签', type: 'text', width: 120, editable: true},
                  {field: 'value', title: '字典值', type: 'text', width: 100, editable: true},
                  {field: 'remark', title: '备注', type: 'text', width: 160, editable: true},
                  {field: 'action', title: '操作', type: 'action', width: 160}
              ],
              config: {
                  table: {
                      scroll: {y: 180}
                  }
              },
              actionMetas: {}
          },
          config: {
              form: {}
          }
      },
      created: function() {
          this.$page.addActionMeta("DictData", {id: 'dictData', position: 'T'
            , label: '字典数据', color: 'green', callBack: function(row) {
              return new Promise(function(resolve, reject) {
                if(row['id']) {
                  vue.editRow = row
                  vue.$refs['det'].open()
                }
                return reject();
              })
            }
          })
          this.dictData.actionMetas['Del'] = this.$page.getActionMeta('Del', {url: '/core/dictData/del'})
          this.dictData.actionMetas['Edit'] = this.$page.getActionMeta('Edit', {url: '/core/dictData/edit'})
          this.dictData.actionMetas['Save'] = this.$page.getActionMeta('Save', {})
          this.dictData.actionMetas['Add'] = this.$page.getActionMeta('Add', {
              url: '/core/dictData/add',
              callBack: function(row) {
                  return new Promise(function(resolve, reject) {
                      row['type'] = vue.editRow['type'];
                      return resolve()
                  })
              }
          });
          this.dictData.actionMetas['View'] = this.$page.getActionMeta('View', {
              url: '/core/dictData/view',
              callBack: function(row) {
                  return new Promise(function(resolve, reject) {
                      row['type'] = vue.editRow['type'];
                      return resolve()
                  })
              }
          });
          this.dictData.actionMetas['Cancel'] = this.$page.getActionMeta('Cancel', {})
      },
  });
</script>
</html>

```
抽屉编辑页
![配置页面](https://images.gitee.com/uploads/images/2020/0414/202611_6cdee6fb_1230742.jpeg "配置页面.jpg")
#### 使用说明
下面通过一些简短的代码片段说明一些开发中常用的功能
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

#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request
