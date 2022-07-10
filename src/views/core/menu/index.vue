<template>
  <ivz-menu-view>
    <ivz-view-search>
      <ivz-input field="name" label="菜单名称" />
    </ivz-view-search>
    <ivz-view-table :columns="columns" size="small" :bordered="true" />
    <ivz-view-modal>
      <template #default="{model}">
        <ivz-input field="name" label="菜单名称" required/>
        <ivz-input field="url" label="访问路径" required/>
        <ivz-input field="perms" label="权限标识" @change="handle"/>
        <ivz-select field="position" label="功能位置" dict="common_status"/>
        <ivz-select field="permType" label="功能类型" :options="permType"/>
        <ivz-input field="remark" label="备注" />
      </template>
    </ivz-view-modal>
  </ivz-menu-view>
</template>

<script>
import IvzMenuView from "@/components/view/IvzMenuView.vue";
import {IvzViewModal, IvzViewTable, IvzViewSearch} from "@/components/view";
import {IvzInput, IvzSelect} from "@/components/form/basic";
export default {
  name: "Menu",
  components: {IvzInput, IvzViewModal, IvzViewTable, IvzViewSearch, IvzMenuView, IvzSelect},
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
      {field: 'name', title: '菜单名称'},
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
  methods: {
    handle(model) {
      let editModel = this.getEditModel();

    }
  }
}
</script>

<style scoped>

</style>
