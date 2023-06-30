<template>
  <UView name="部门" auth>
    <UViewSearch bread>
      <URow col="search">
        <UInput field="name" label="部门名称"/>
        <UInput field="phone" label="手机号"/>
        <UFuncBtn func="query" url="/core/org/view">搜索</UFuncBtn>
        <UFuncBtn func="reset">重置</UFuncBtn>
      </URow>
      <template #func>
        <UFuncBtn func="add" v-auth="'core:org:add'">新增</UFuncBtn>
        <UFuncBtn func="expand">展开/缩收</UFuncBtn>
      </template>
    </UViewSearch>
    <UViewTable :columns="columns" :scroll="{x: 800}">
      <template #c_action="{record}">
        <UFuncTag func="add:child" :data="record" v-auth="'core:org:add'" :config="{pid: 'pid'}">新增子部门</UFuncTag>
        <UFuncTag func="edit" :data="record" url="/core/org/edit">修改</UFuncTag>
        <UFuncTag func="del" :data="record" url="/core/org/del">删除</UFuncTag>
      </template>
    </UViewTable>
    <UViewModal :span="[7, 15]" :rules="rules" title="部门管理">
      <UTreeSelect field="pid" label="上级部门" valueField="id"
           :defaultValue="0" url="/core/org/parent" labelField="name"
           treeNodeFilterProp="label"/>
      <UInput field="name" label="部门名称"/>
      <UInput field="leader" label="部门负责人"/>
      <UInput field="phone" label="负责人手机号"/>
      <template #footer="{model}">
        <UFuncBtn func="cancel">取消</UFuncBtn>
        <UFuncBtn func="submit" :url="model.id ? '/core/org/edit' : '/core/org/add'">提交</UFuncBtn>
        <UFuncBtn func="reset">重置</UFuncBtn>
      </template>
    </UViewModal>
  </UView>
</template>
<!--部门管理-->
<script>

export default {
  name: "Dept",
  setup() {
    let columns = [
      {field: 'name', title: '部门名称', align: 'left'},
      {field: 'leader', title: '部门负责人'},
      {field: 'phone', title: '负责人手机号'},
      {field: 'createTime', title: '创建时间'},
      {field: 'action', type:'action', title: '操作'},
    ]

    let rules = {
      name: {required: true, message: '部门名称必填'},
      pid: {type: 'number', required: true, message: '请选择所属部门'},
    }

    return {columns, rules}
  }
}
</script>

<style scoped>

</style>
