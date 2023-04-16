<template>
  <IvzBasicView auth>
    <IvzBasicSearch primary>
      <IvzInput label="操作用户" field="userName" span="5" />
      <IvzSelect label="功能" span="5" field="title" :options="permType"/>
      <IvzSelect label="状态" span="5" field="status" :options="SuccessStatus"/>
      <IvzInputNumber label="执行时间>(ms)" span="5" field="millis" />
      <IvzFuncBtn func="reset">重置</IvzFuncBtn>
      <IvzFuncBtn func="query" url="/core/log/view">搜索</IvzFuncBtn>
    </IvzBasicSearch>
    <IvzViewTable :columns="columns" size="small" :bordered="true">
<!--      <template #c_action="{record}">-->
<!--        <IvzFuncTag func="edit" :data="record" url="/core/dictType/edit">修改</IvzFuncTag>-->
<!--        <IvzFuncTag func="del" :data="record" url="/core/dictType/del">删除</IvzFuncTag>-->
<!--      </template>-->
    </IvzViewTable>
  </IvzBasicView>
</template>

<script>
import {FunMetaMaps} from "@/utils/MetaUtils";
import {SuccessStatus} from "@/utils/StatusConsts";

export default {
  name: "Log",
  setup() {
    let permType = [
      {label: '新增', value: FunMetaMaps.Add},
      {label: '删除', value: FunMetaMaps.Del},
      {label: '编辑', value: FunMetaMaps.Edit},
      {label: '搜索', value: FunMetaMaps.View},
      {label: '详情', value: FunMetaMaps.Detail},
      {label: '导入', value: FunMetaMaps.Import},
      {label: '导出', value: FunMetaMaps.Export},
      {label: '自定义', value: ''},
    ]
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
      // {field: 'action', title: '操作', type: 'action'},
    ]

    return {columns, permType, SuccessStatus}
  }
}
</script>

<style scoped>

</style>
