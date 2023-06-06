<template>
  <UView auth>
    <USearch primary>
      <UInput label="操作用户" field="userName" span="5" />
      <USelect label="状态" span="5" field="status" :options="SuccessStatus"/>
      <UInputNumber label="执行时间>(ms)" span="5" field="millis" />
      <UFuncBtn func="reset">重置</UFuncBtn>
      <UFuncBtn func="query" url="/core/log/view">搜索</UFuncBtn>
    </USearch>
    <UViewTable :columns="columns" size="small" :bordered="true">
      <template #c_action="{record}">
        <UFuncTag func="del" :data="record" url="/core/log/del">删除</UFuncTag>
      </template>
    </UViewTable>
  </UView>
</template>

<script>
import {SuccessStatus} from "@/utils/StatusConsts";

export default {
  name: "Log",
  setup() {
    let columns = [
      {field: 'userName', title: '操作用户', ellipsis: true},
      {field: 'title', title: '功能', width: 58},
      {field: 'msn', title: '操作模块'},
      {field: 'url', title: '执行地址', width: 168, ellipsis: true},
      {field: 'millis', title: '执行时间(ms)', width: 120},
      {field: 'ip', title: '访问ip', ellipsis: true},
      {field: 'errMsg', title: '日志', ellipsis: true},
      {field: 'status', title: '状态', options: SuccessStatus, width: 58},
      {field: 'createTime', title: '创建时间', type: 'date', width: 160},
      {field: 'action', title: '操作', type: 'action'},
    ]

    return {columns, SuccessStatus}
  }
}
</script>

<style scoped>

</style>
