<template>
  <UView auth>
    <UViewSearch>
      <UInput label="字典名称" field="name" />
      <UInput label="字典类型" field="type"/>
      <USelect label="字典状态" field="status" :options="status" span="5"/>
      <template #func>
        <UFuncBtn func="reset">重置</UFuncBtn>
        <UFuncBtn func="query" url="/core/dictType/view">搜索</UFuncBtn>
        <UFuncBtn func="add" url="/core/dictType/add">新增</UFuncBtn>
      </template>
    </UViewSearch>
    <UViewTable :columns="columns">
      <template #type="{text}">
        <router-link :to="{path: '/dict/data', query: {type: text}}">{{text}}</router-link>
      </template>
      <template #c_action="{record}">
        <UFuncTag func="edit" :data="record" url="/core/dictType/edit">修改</UFuncTag>
        <UFuncTag func="del" :data="record" url="/core/dictType/del">删除</UFuncTag>
      </template>
    </UViewTable>
    <UViewModal :rules="rules" title="字典管理" :span="[6, 16]">
      <template #default="{model}">
        <UInput label="字典名称" field="name" />
        <UInput label="字典标识" field="type" :disabled="model.id ? true : false" />
        <URadio label="字典状态" field="status" :options="status"/>
        <UInput label="备注" field="remark" />
      </template>
      <template #footer="{model}">
        <UFuncBtn func="cancel">取消</UFuncBtn>
        <UFuncBtn func="submit" :url="model.id ? '/core/dictType/edit' : '/core/dictType/add'">提交</UFuncBtn>
        <UFuncBtn func="reset">重置</UFuncBtn>
      </template>
    </UViewModal>
  </UView>
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
      {field: 'type', title: '字典标识'},
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
