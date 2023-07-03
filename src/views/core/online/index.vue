<template>
  <UView auth>
    <UViewSearch bread>
      <URow col="search">
        <UInput label="登录用户" field="userNick"/>
        <USelect label="在线状态" field="status" :options="OnlineStatus"/>
        <UFuncBtn func="query" url="/core/online/view">搜索</UFuncBtn>
        <UFuncBtn func="reset">重置</UFuncBtn>
      </URow>
      <template #func>
        <UFuncBtn func="del" url="/core/online/del">删除</UFuncBtn>
      </template>
    </UViewSearch>
    <UViewTable :columns="columns" :scroll="{x: 1000}" :rowSelection="{}">
      <template #status="{record, value}">
        <ABadge v-if="record.status=='Online'" status="processing" :text="value" />
        <ABadge v-else status="default" :text="value" />
      </template>
      <template #c_action="{record}">
        <UFuncTag func="confirm" :data="record" url="/core/online/offline"
            :config="{confirmTitle: '剔除确认', confirmContent: '确认强制下线此用户吗?'}">剔除</UFuncTag>
      </template>
    </UViewTable>
  </UView>
</template>

<script>

export default {
  name: "Online",
  setup() {
    let OnlineStatus = [
      {label: '在线', value: 'Online'},
      {label: '离线', value: 'Offline'},
    ]

    let columns = [
      {field: 'userNick', title: '登录用户', width: 138},
      {field: 'loginTime', title: '登录时间', width: 160, type: 'date'},
      {field: 'os', title: '系统', width: 128},
      {field: 'browse', title: '浏览器', width: 100},
      {field: 'accessIp', title: '登录ip', width: 138},
      {field: 'updateTime', title: '最后访问时间', type: 'date', width: 160},
      {field: 'status', title: '在线状态', width: 78, options: OnlineStatus},
      {field: 'action', title: '操作', type: 'action', width: 138},
    ]
    return {columns, OnlineStatus}
  }
}
</script>

<style scoped>

</style>