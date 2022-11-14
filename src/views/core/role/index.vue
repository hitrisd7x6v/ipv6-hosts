<template>
  <ivz-menu-view name="角色管理">
    <ivz-primary-search ref="ivzForm">
      <ivz-input label="角色名称" field="name" />
      <ivz-radio label="状态" field="status" :options="status"/>
    </ivz-primary-search>
    <ivz-primary-modal :span="[5, 16]" :rules="rules">
      <ivz-input label="角色名称" field="name" />
      <ivz-radio label="状态" field="status" :options="status" defaultValue="enabled"/>
      <ivz-input-number label="排序" field="sort" :defaultValue="10"/>
      <ivz-textarea label="备注" field="remark" />
    </ivz-primary-modal>
    <ivz-primary-table :columns="columns" :bordered="true" size="small"/>
  </ivz-menu-view>
</template>

<script>
export default {
  name: "Role",
  setup() {
    let status = [
      {label: '启用', value: 'enabled'}, {label: '禁用', value: 'disabled'}
    ]
    let columns = [
      {field: 'name', title: '名称'},
      {field: 'status', title: '状态', options: status},
      {field: 'sort', title: '排序'},
      {field: 'remark', title: '备注'},
      {field: 'createTime', title: '创建时间', type: 'datetime', picker: 'date'},
      {field: 'action', title: '操作', type: 'action'}
    ]
    let rules = {
      name: {required: true, message: '角色名称必填'}
    }
    return {columns, rules, status}
  },
  methods: {

  }
}
</script>

<style scoped>

</style>
