<template>
  <ivz-menu-view>
    <ivz-view-search>
      <ivz-input label="字典名称" field="name" />
      <ivz-select label="字典状态" field="status" :options="status"/>
    </ivz-view-search>
    <ivz-view-table :columns="columns" size="small" :bordered="true"/>
    <ivz-view-modal :rules="rules">
      <ivz-input label="字典名称" field="name" />
      <ivz-input label="字典类型" field="type" />
      <ivz-radio label="字典状态" field="status" :options="status"/>
      <ivz-input label="备注" field="remark" />
    </ivz-view-modal>
  </ivz-menu-view>
</template>
<!--字典管理-->
<script>
export default {
  name: "DictType",
  setup() {
    let status = [
      {label: '启用', value: 'enabled'}, {label: '禁用', value: 'disabled'}
    ]

    let columns = [
      {field: 'name', title: '字典名称'},
      {field: 'type', title: '字典类型'},
      {field: 'status', title: '字典状态', options: status},
      {field: 'remark', title: '备注'},
      {field: 'createTime', title: '创建时间'},
      {field: 'action', title: '操作'},
    ]

    let rules = {
      name: {required: true, message: '字典名称必填'},
      type: {required: true, message: '字典类型必填'},
    }

    return {columns, rules, status}
  }
}
</script>

<style scoped>

</style>
