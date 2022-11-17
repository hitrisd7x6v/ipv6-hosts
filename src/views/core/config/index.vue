<template>
  <ivz-menu-view name="配置">
    <IvzPrimarySearch>
      <ivz-input field="name" label="配置名称"/>
      <ivz-input field="label" label="配置标识"/>
      <ivz-radio field="type" label="系统配置" :options="type"/>
    </IvzPrimarySearch>
    <IvzPrimaryTable :columns="columns" :bordered="true" size="small" />
    <IvzPrimaryModal :span="[6, 15]" :rules="rules">
      <template #default="{model}">
        <ivz-input field="name" label="配置名称"/>
        <ivz-input field="label" label="配置标识" :disabled="model.id != null"/>
        <ivz-input field="value" label="配置值" />
        <ivz-radio field="type" label="系统配置" :options="type" defaultValue="def"/>
        <ivz-textarea field="remark" label="配置说明" />
      </template>
      <template #title="{model}">
        {{model.id != null ? '修改配置' : '新增配置'}}
      </template>
    </IvzPrimaryModal>
  </ivz-menu-view>
</template>
<!--系统配置管理-->
<script>

import {IvzPrimarySearch, IvzPrimaryModal, IvzPrimaryTable} from "@/components/view";
export default {
  name: "Config",
  components: {IvzPrimaryTable, IvzPrimarySearch, IvzPrimaryModal},
  setup() {
    let type = [
      {label: '是', value:'sys'}, {label: '否', value: 'def'}
    ]
    let columns = [
      {field: 'name', title: '配置名称'},
      {field: 'label', title: '配置标识'},
      {field: 'value', title: '配置值'},
      {field: 'type', title: '系统配置', options: type},
      {field: 'remark', title: '配置说明'},
      {field: 'action', type: 'action', title: '操作'}
    ]
    let rules = {
      name: {required: true, message: '配置名称必填'},
      label: {required: true, message: '配置标识必填'},
      value: {required: true, message: '配置值必填'},
    }
    return {columns, type, rules}
  }
}
</script>

<style scoped>

</style>
