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
      {field: '', type: 'selection'},
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

<style scoped>

</style>
