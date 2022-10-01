<template>
  <ivz-menu-view :expand="true" name="菜单">
    <ivz-view-search>
      <ivz-input field="name" label="菜单名称" />
    </ivz-view-search>
    <ivz-view-table :columns="columns" size="small" :pagination="false" />
    <ivz-view-drawer :rules="rules" :width="680" layout="vertical">
      <a-row :gutter="24">
        <a-col span="12">
          <ivz-input field="name" label="菜单名称"/>
        </a-col>
        <a-col span="12">
          <ivz-tree-select field="pid" label="父菜单" :defaultValue="0"
               url="/core/menu/parent" :showSearch="true"/>
        </a-col>
        <a-col span="12">
          <ivz-select field="type" label="菜单类型" :options="type" @change="typeHandle"/>
        </a-col>
        <a-col span="12">
          <ivz-input field="url" label="菜单地址"/>
        </a-col>
        <a-col span="12">
          <ivz-select field="position" label="功能位置" :options="position"/>
        </a-col>
        <a-col span="12">
          <ivz-select field="permType" label="功能点" :options="permType" mode="combobox"/>
        </a-col>
        <a-col span="12">
          <ivz-input field="perms" label="权限标识"/>
        </a-col>
        <a-col span="12">
          <ivz-input-number field="sort" label="排序" :defaultValue="80"/>
        </a-col>
        <a-col span="12">
          <ivz-input field="icon" label="图标" />
        </a-col>
      </a-row>
    </ivz-view-drawer>
  </ivz-menu-view>
</template>

<script>
import {FunMetaMaps} from "@/utils/SysUtils";

export default {
  name: "Menu",
  setup() {
    let type = [
      {label: '目录', value: 'M'},
      {label: '视图', value: 'V'},
      {label: '功能', value: 'A'},
    ]
    let permType = [
      {label: '新增', value: FunMetaMaps.Add},
      {label: '删除', value: FunMetaMaps.Del},
      {label: '编辑', value: FunMetaMaps.Edit},
      {label: '搜索', value: FunMetaMaps.View},
      {label: '详情', value: FunMetaMaps.Detail},
      {label: '导入', value: FunMetaMaps.Import},
      {label: '导出', value: FunMetaMaps.Export},
      {label: '自定义', value: ''},
    ]

    let position = [
      {label: '全部', value: 'AM'},
      {label: '搜索栏', value: 'M'},
      {label: '表格栏', value: 'T'},
    ];

    const columns = [
      {field: 'name', title: '菜单名称', align: 'left'},
      {field: 'url', title: '访问路径'},
      {field: 'type', title: '菜单类型', options: type},
      {field: 'perms', title: '权限标识'},
      {field: 'permType', title: '功能点', options: permType},
      {field: 'position', title: '功能位置', options: position},
      {field: 'createTime', title: '创建时间', type: 'datetime'},
      {field: 'action', title: '操作', type: 'action'},
    ]
    let rules = {
      pid: {type: 'number', required: true},
      name: {required: true, message: '菜单名称'},
      type: {required: true, message: '菜单类型必填'},
      position: {required: false, message: '功能位置必填'},
    }
    return {columns, permType, rules, position, type}
  },
  mounted() {
    let addFunMeta = this.getTableFunMeta(FunMetaMaps.Add);
    if(addFunMeta) {
      // 覆盖表格新增功能点的默认实现
      addFunMeta.callback = (row, meta, {openEditView}) => {
        openEditView(addFunMeta).then(model => {
          model['pid'] = row.id
          if(row.type == 'V') {
            model.type = 'A'
          }
        });
      }

      // 如果是功能类型, 则不能删除
      addFunMeta.disabled = (row) => {
        if(row['type'] == 'A') {
          return true;
        }
        return false;
      }
    }
  },
  methods: {
    typeHandle(val) {
      let {validate} = this.getEditContext();

      if(val == 'A') {
        this.rules['position'].required = true;
      } else {
        this.rules['position'].required = false;
      }

      validate('position');
    }
  }
}
</script>

<style scoped>

</style>
