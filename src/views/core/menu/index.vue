<template>
  <ivz-menu-view :expand="true" name="菜单">
    <ivz-view-search>
      <ivz-input field="name" label="菜单名称" />
    </ivz-view-search>
    <ivz-view-table :columns="columns" size="small" :pagination="false" />
    <ivz-view-drawer :rules="rules" :width="820" layout="vertical">
      <a-row>
        <a-col span="8">
          <ivz-input field="name" label="菜单名称" required/>
        </a-col>
        <a-col span="8">
          <ivz-tree-select field="pid" label="父菜单" :defaultValue="0" url="/core/menu/parent"/>
        </a-col>
        <a-col span="8">
          <ivz-input field="url" label="访问路径" required/>
        </a-col>
      </a-row>
      <ivz-input field="perms" label="权限标识" @change="handle"/>
      <ivz-select field="position" label="功能位置" :options="position"/>
      <ivz-select field="permType" label="功能类型" :options="permType"/>
      <ivz-input field="remark" label="备注" />
    </ivz-view-drawer>
  </ivz-menu-view>
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
    let rules = {
      pid: {type: 'number', required: true}
    }
    return {columns, permType, rules, position}
  },
  mounted() {
    let addFunMeta = this.getTableFunMeta(FunMetaMaps.Add);
    // 覆盖表格新增功能点的默认实现
    addFunMeta.callback = (row, meta, {switchEditView}) => {
      switchEditView(true);
      this.$nextTick().then(() => {
        let editModel = this.getEditModel();
        editModel['pid'] = row.id;
      })
    }
  },
  methods: {
    handle(model) {
      let editModel = this.getEditModel();

    }
  }
}
</script>

<style scoped>

</style>
