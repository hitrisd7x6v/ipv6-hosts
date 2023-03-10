<template>
  <IvzBasicView name="部门">
    <IvzViewSearch>
      <ivz-input field="name" label="部门名称"/>
      <ivz-input field="phone" label="手机号"/>
      <template #func>
        <IvzFuncBtn func="query" url="/core/org/view">搜索</IvzFuncBtn>
        <IvzFuncBtn func="reset">重置</IvzFuncBtn>
        <IvzFuncBtn func="add" url="/core/org/add">新增</IvzFuncBtn>
        <IvzFuncBtn func="expand">展开/缩收</IvzFuncBtn>
      </template>
    </IvzViewSearch>
    <IvzViewTable :columns="columns" size="small" :pagination="false">
      <template #c_action="{record}">
        <IvzFuncTag func="add:child" :data="record" url="/core/org/add">新增子部门</IvzFuncTag>
        <IvzFuncTag func="edit" :data="record" url="/core/org/edit">修改</IvzFuncTag>
        <IvzFuncTag func="del" :data="record" url="/core/org/del">删除</IvzFuncTag>
      </template>
    </IvzViewTable>
    <IvzViewModal :span="[7, 15]" :rules="rules">
      <ivz-tree-select field="pid" label="上级部门" valueField="id"
           :defaultValue="0" url="/core/org/parent" labelField="name"
           treeNodeFilterProp="label"/>
      <ivz-input field="name" label="部门名称"/>
      <ivz-input field="leader" label="部门负责人"/>
      <ivz-input field="phone" label="负责人手机号"/>
      <template #title="{model}">
        {{model.id != null ? '修改部门' : '新增部门'}}
      </template>
      <template #footer="{model}">
        <IvzFuncBtn func="cancel">取消</IvzFuncBtn>
        <IvzFuncBtn func="submit" :url="model.id ? '/core/org/edit' : '/core/org/add'">提交</IvzFuncBtn>
        <IvzFuncBtn func="reset">重置</IvzFuncBtn>
      </template>
    </IvzViewModal>
  </IvzBasicView>
</template>
<!--部门管理-->
<script>
import {FunMetaMaps} from "@/utils/MetaUtils";

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
