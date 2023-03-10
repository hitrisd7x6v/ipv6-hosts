<template>
  <ivz-menu-view>
    <IvzViewSearch>
      <IvzInput label="字典名称" field="name" />
      <IvzInput label="字典类型" field="type"/>
      <IvzSelect label="字典状态" field="status" :options="status" span="6"/>
      <template #func>
        <IvzFuncBtn func="reset">重置</IvzFuncBtn>
        <IvzFuncBtn func="query" url="/core/dictType/view">搜索</IvzFuncBtn>
        <IvzFuncBtn func="add" url="/core/dictType/add">新增</IvzFuncBtn>
      </template>
    </IvzViewSearch>
    <IvzViewTable :columns="columns" size="small" :bordered="true">
      <template #c_type="{text}">
        <router-link :to="{path: '/dict/data', query: {type: text}}">{{text}}</router-link>
      </template>
      <template #c_action="{record}">
        <IvzFuncTag func="edit" :data="record" url="/core/dictType/edit">修改</IvzFuncTag>
        <IvzFuncTag func="del" :data="record" url="/core/dictType/del">删除</IvzFuncTag>
      </template>
    </IvzViewTable>
    <IvzViewModal :rules="rules" title="字典管理" :span="[6, 16]">
      <ivz-input label="字典名称" field="name" />
      <ivz-input label="字典标识" field="type" />
      <ivz-radio label="字典状态" field="status" :options="status"/>
      <ivz-input label="备注" field="remark" />
      <template #title="{model}">
        {{model.id != null ? '修改字典' : '新增字典'}}
      </template>
      <template #footer="{model}">
        <IvzFuncBtn func="cancel">取消</IvzFuncBtn>
        <IvzFuncBtn func="submit" :url="model.id ? '/core/dictType/edit' : '/core/dictType/add'">提交</IvzFuncBtn>
        <IvzFuncBtn func="reset">重置</IvzFuncBtn>
      </template>
    </IvzViewModal>
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
