<template>
  <UView name="配置" auth>
    <UViewSearch>
      <UInput field="name" label="配置名称"/>
      <UInput field="label" label="配置标识"/>
      <URadio field="type" label="系统配置" :options="type"/>
      <template #func>
        <UFuncBtn func="reset">重置</UFuncBtn>
        <UFuncBtn func="query" url="/core/config/view">搜索</UFuncBtn>
        <UFuncBtn func="add" url="/core/config/add">新增</UFuncBtn>
      </template>
    </UViewSearch>
    <UViewTable :columns="columns" :scroll="{x: 800}">
      <template #c_action="{record}">
        <UFuncTag func="edit" :data="record" url="/core/config/edit">修改</UFuncTag>
        <UFuncTag func="del" :data="record" url="/core/config/del">删除</UFuncTag>
      </template>
    </UViewTable>
    <UViewModal :span="[6, 15]" :rules="rules">
      <template #default="{model}">
        <UInput field="name" label="配置名称"/>
        <UInput field="label" label="配置标识" :disabled="model.id != null"/>
        <UInput field="value" label="配置值" />
        <URadio field="type" label="系统配置" :options="type" defaultValue="def"/>
        <UTextarea field="remark" label="配置说明" />
      </template>
      <template #title="{model}">
        {{model.id != null ? '修改配置' : '新增配置'}}
      </template>
      <template #footer="{model}">
        <UFuncBtn func="cancel">取消</UFuncBtn>
        <UFuncBtn func="submit" :url="model.id ? '/core/config/edit' : '/core/config/add'">提交</UFuncBtn>
        <UFuncBtn func="reset">重置</UFuncBtn>
      </template>
    </UViewModal>
  </UView>
</template>
<!--系统配置管理-->
<script>

export default {
  name: "Config",
  setup() {
    let type = [
      {label: '是', value:'sys'}, {label: '否', value: 'def'}
    ]
    let columns = [
      {field: 'name', title: '配置名称'},
      {field: 'label', title: '配置标识'},
      {field: 'value', title: '配置值'},
      {field: 'type', title: '系统配置', options: type},
      {field: 'remark', title: '配置说明', width: 260},
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
