<h3>页级视图组件之 IvzBasicView</h3>

代码演示
---

```vue demo
<template>
  <IvzBasicView>
    <IvzBasicSearch primary>
      <IvzInput field="name" label="茶叶名称"/>
      <AButton type="primary" @click="query">查询</AButton>&nbsp;
      <AButton @click="add">新增</AButton>
    </IvzBasicSearch>
    <IvzBasicTable primary :bordered="true" :columns="columns" :dataSource="dataSource" rowKey="id">
      <template #c_action="{record}">
        <ATag color="blue" @click="add">新增</ATag>
        <ATag color="red" @click="() => del(record)">删除</ATag>
      </template>
    </IvzBasicTable>
    <IvzBasicModal primary>
      <IvzInput field="name" label="茶叶名称"/>
      <template #title="{model}">
        {{model.id ? '编辑产品' : '新增产品'}}
      </template>
    </IvzBasicModal>
  </IvzBasicView>
</template>

<script>
export default {
  name: "Demo",
  setup() {
    let columns = [
      {field: 'name', title: '产品名称'},
      {field: 'type', title: '产品类型'},
      {field: 'action', type:'action', title: '操作'},
    ]
    let dataSource = [
      {id: 1, name: '清香秋茶', type: '清香型'}
    ]
    return {columns, dataSource}
  },
  methods: {
    add() {
      this.$view.openForAdd();
    },
    del(row) {
      this.$view.del('/product/del', [row.id]);
    },
    query() {
      this.$view.query('/product/list');
    }
  }
}
</script>
```
