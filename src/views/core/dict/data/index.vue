<template>
  <IvzBasicView>
    <IvzBasicSearch primary>
      <ivz-select label="字典标识" field="type" @change="loadDictData" span="5"
                  url="/core/dictType/list" labelField="name" valueField="type"
                  :defaultValue="type"/>
      <ivz-input label="数据名称" field="name" />
      <IvzFuncBtn func="query" url="/core/dictData/view">查询</IvzFuncBtn>&nbsp;
      <IvzFuncBtn func="add" url="/core/dictData/add">新增</IvzFuncBtn>&nbsp;
    </IvzBasicSearch>
    <IvzBasicDrawer title="新增" :span="[6, 16]" primary :rules="rules" @edit="edit">
        <IvzInput field="type" label="字典标识" disabled/>
        <IvzInput field="label" label="数据名称" />
        <IvzInput field="value" label="数据值" />
        <IvzRadio field="status" label="状态" dict="sys.status" :defaultValue="'enabled'"/>
        <IvzInputNumber field="sort" label="排序" :defaultValue="10"/>
      <template #footer="{model}">
        <div style="text-align: center">
          <IvzFuncBtn func="cancel">取消</IvzFuncBtn>
          <IvzFuncBtn func="submit" :url="model.id ? '/core/dictData/edit' : '/core/dictData/add'">提交</IvzFuncBtn>&nbsp;
          <IvzFuncBtn func="reset">重置</IvzFuncBtn>&nbsp;
        </div>
      </template>
    </IvzBasicDrawer>
    <IvzBasicTable :columns="columns" size="small" rowKey="id"
             :bordered="true" primary :pagination="false">
      <template #c_action="{record}">
        <IvzFuncTag func="edit" :data="record" url="/core/dictData/edit">编辑</IvzFuncTag>
        <IvzFuncTag func="del" :data="record" url="/core/dictData/del">删除</IvzFuncTag>
      </template>
    </IvzBasicTable>
  </IvzBasicView>
</template>

<script>
/*字典数据页面*/
import {useRouter} from "vue-router";

export default {
  name: "DictData",
  setup() {
    let columns = [
      {title: '字典标识', field: 'type'},
      {title: '数据名称', field: 'label'},
      {title: '数据值', field: 'value'},
      {title: '状态', field: 'status', dict: 'sys.status'},
      {title: '排序', field: 'sort'},
      {title: '备注', field: 'remark'},
      {title: '操作', field: 'action', type: 'action'},
    ]

    let rules = {
      label: {required: true, message: '字典标签必填'},
      value: {required: true, message: '标签值必填'},
    }
    let type = useRouter().currentRoute.value.query.type;
    return {columns, rules, type};
  },
  watch: {
    $route(to, form) {
      let type = to.query.type;
      if(type) {
        let model = this.$view.getSearchModel();
        if(model.type != type) {
          model.type = type;
          this.query();
        }
      }
    }
  },
  methods: {
    query() {
      this.$view.query();
    },

    edit(model) {
      model.type = this.$route.query.type;
    },

    loadDictData() {
      this.query();
    },
  }
}
</script>

<style scoped>

</style>
