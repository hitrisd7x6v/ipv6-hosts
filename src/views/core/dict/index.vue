<template>
  <ivz-menu-view>
    <IvzPrimarySearch>
      <ivz-input label="字典名称" field="name" />
      <ivz-select label="字典状态" field="status" :options="status" span="5"/>
    </IvzPrimarySearch>
    <IvzPrimaryTable :columns="columns" size="small" :bordered="true">
      <template #c_type="{text}">
        <router-link :to="{path: '/dict/data', query: {type: text}}">{{text}}</router-link>
      </template>
    </IvzPrimaryTable>
    <IvzPrimaryModal :rules="rules" title="字典管理" :span="[6, 16]">
      <ivz-input label="字典名称" field="name" />
      <ivz-input label="字典标识" field="type" />
      <ivz-radio label="字典状态" field="status" :options="status"/>
      <ivz-input label="备注" field="remark" />
      <template #title="{model}">
        {{model.id != null ? '修改字典' : '新增字典'}}
      </template>
    </IvzPrimaryModal>
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
      {field: 'action', title: '操作', type: 'action'},
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
