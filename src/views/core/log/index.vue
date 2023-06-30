<template>
  <UView auth>
    <UViewSearch>
      <URow col="search">
        <UInput label="操作用户" field="userName" />
        <USelect label="状态" field="status" :options="SuccessStatus"/>
        <UInputNumber label="执行时间>(ms)" field="millis" />
        <UFuncBtn func="reset">重置</UFuncBtn>
        <UFuncBtn func="query" url="/core/log/view">搜索</UFuncBtn>
      </URow>
    </UViewSearch>
    <UViewTable :columns="columns" :scroll="{x: 1200}">
      <template #c_action="{record}">
        <UFuncTag func="del" :data="record" url="/core/log/del">删除</UFuncTag>
      </template>
    </UViewTable>
  </UView>
</template>

<script>
import {SuccessStatus} from "@/utils/StatusConsts";
import {reactive} from "vue";

export default {
  name: "Log",
  setup() {
    let columns = reactive([
      {field: 'userName', title: '操作用户', ellipsis: true},
      {field: 'msn', title: '操作模块', width: 120},
      {field: 'title', title: '功能', width: 64, ellipsis: true},
      {field: 'url', title: '请求地址', width: 160, ellipsis: true, resizable: true},
      {field: 'millis', title: '执行时间(ms)', width: 120},
      {field: 'ip', title: '访问ip', ellipsis: true},
      {field: 'errMsg', title: '日志', ellipsis: true, resizable: true, width: 160},
      {field: 'status', title: '状态', options: SuccessStatus, width: 60},
      {field: 'createTime', title: '创建时间', type: 'date', width: 160},
      {field: 'action', title: '操作', type: 'action', width: 80},
    ])

    return {columns, SuccessStatus}
  }
}
</script>

<style scoped>

</style>
