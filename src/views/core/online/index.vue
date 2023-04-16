<template>
  <IvzBasicView auth>
    <IvzBasicSearch primary>
      <IvzInput label="登录用户" field="userNick" span="5" />
      <IvzSelect label="在线状态" field="status" span="5" :options="OnlineStatus"/>
      <IvzFuncBtn func="reset">重置</IvzFuncBtn>
      <IvzFuncBtn func="query" url="/core/onlineUser/view">搜索</IvzFuncBtn>
    </IvzBasicSearch>
    <IvzViewTable :columns="columns" size="small" :bordered="true" :scroll="{x: '100%'}">
      <template #c_status="{record}">
        <ABadge v-if="record.status=='Online'" status="processing" text="在线" />
        <ABadge v-else status="default" text="掉线" />
      </template>
      <template #c_action="{record}">
        <IvzFuncTag func="del" :data="record" url="/core/onlineUser/del">删除</IvzFuncTag>
        <IvzFuncTag func="offline" :data="record" url="/core/onlineUser/offline" confirm>下线</IvzFuncTag>
      </template>
    </IvzViewTable>
  </IvzBasicView>
</template>

<script>

export default {
  name: "Online",
  setup() {
    let OnlineStatus = [
      {label: '在线', value: 'Online'},
      {label: '掉线', value: 'Offline'},
    ]

    let columns = [
      {field: 'userNick', title: '登录用户', width: 138, fixed: 'left'},
      {field: 'loginTime', title: '登录时间', width: 160, type: 'date'},
      {field: 'os', title: '系统', width: 128},
      {field: 'browse', title: '浏览器', width: 100},
      {field: 'expireTime', title: '过期时间(s)', width: 118},
      {field: 'accessIp', title: '登录ip', width: 138},
      {field: 'updateTime', title: '最后访问时间', type: 'date', width: 160},
      {field: 'status', title: '在线状态', width: 78, fixed: 'right'},
      {field: 'action', title: '操作', type: 'action', width: 138, fixed: 'right'},
    ]
    return {columns, OnlineStatus}
  }
}
</script>

<style scoped>

</style>