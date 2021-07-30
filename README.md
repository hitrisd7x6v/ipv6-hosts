# ivzone

#### 介绍
1. 使用vue、antdv开发的多页面组件, 一个视图组件即一个页面(html)；视图组件包含了增删改查常用功能。
2. 充分发挥vue框架数据驱动视图的能力， 使得字典，select等常见组件数据获取到展示的便利性以及表格对这些组件的数据格式展示能力，最大简化了前端开发
3. 项目采用json数据格式定义一个页面， 这使得创建一个页面只需要定义一些字段的描述性语言
4. 以下是系统的一些页面展示, 以及对应的代码，以菜单页为例(使用<ivz-basic-view>组件)
菜单管理列表页
![菜单列表页](https://images.gitee.com/uploads/images/2020/0414/191721_edecbc42_1230742.jpeg "1586862411(1).jpg")
菜单管理编辑页
![菜单编辑页面](https://images.gitee.com/uploads/images/2020/0414/191936_2f45126b_1230742.jpeg "编辑菜单页面.jpg")
6. 实现菜单页增删改查的代码
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

#### 软件架构
软件架构说明


#### 安装教程


#### 使用说明


#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request
