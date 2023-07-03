<template>
  <UView>
    <UViewSearch v-model="searchModel">
      <URow col="search">
        <USelect label="字典标识" field="type" @change="loadDictData"
                 url="/core/dictType/list" labelField="name" valueField="type"
                 :defaultValue="type"/>
        <UInput label="数据名称" field="name" />
        <UFuncBtn func="query" url="/core/dictData/view" ref="queryFunc">查询</UFuncBtn>&nbsp;
        <UFuncBtn func="add" url="/core/dictData/add">新增</UFuncBtn>&nbsp;
      </URow>
    </UViewSearch>
    <UViewDrawer title="新增" :span="[6, 16]" :rules="rules" @edit="edit">
        <UInput field="type" label="字典标识" disabled/>
        <UInput field="label" label="数据名称" />
        <UInput field="value" label="数据值" />
        <URadio field="status" label="状态" dict="sys_func_status" :defaultValue="'enabled'"/>
        <UInputNumber field="sort" label="排序" :defaultValue="10"/>
      <template #footer="{model}">
        <div style="text-align: center">
          <UFuncBtn func="cancel">取消</UFuncBtn>
          <UFuncBtn func="submit" :url="model.id ? '/core/dictData/edit' : '/core/dictData/add'">提交</UFuncBtn>&nbsp;
          <UFuncBtn func="reset">重置</UFuncBtn>&nbsp;
        </div>
      </template>
    </UViewDrawer>
    <UViewTable :columns="columns" rowKey="id" :scroll="{x: 1000}">
      <template #c_action="{record}">
        <UFuncTag func="edit" :data="record" url="/core/dictData/edit">编辑</UFuncTag>
        <UFuncTag func="del" :data="record" url="/core/dictData/del">删除</UFuncTag>
      </template>
    </UViewTable>
  </UView>
</template>

<script>
/*字典数据页面*/
import {useRouter} from "vue-router";
import CoreConsts from "@/components/CoreConsts";

export default {
  name: "DictData",
  setup() {
    let columns = [
      {title: '字典标识', field: 'type'},
      {title: '数据名称', field: 'label'},
      {title: '数据值', field: 'value'},
      {title: '状态', field: 'status', dict: 'sys_func_status'},
      {title: '排序', field: 'sort'},
      {title: '备注', field: 'remark'},
      {title: '操作', field: 'action', type: 'action'},
    ]

    let rules = {
      label: {required: true, message: '字典标签必填'},
      value: {required: true, message: '标签值必填'},
    }

    let searchModel = {};
    let type = useRouter().currentRoute.value.query.type;
    return {columns, rules, type, searchModel};
  },
  watch: {
    $route(to, form) {
      let type = to.query.type;
      if(type) {
        if(this.searchModel.type != type) {
          this.searchModel.type = type;
          this.query();
        }
      }
    }
  },
  methods: {
    query() {
      this.$refs['queryFunc'].trigger();
    },

    edit(model) {
      model.type = this.searchModel.type;
    },

    loadDictData() {
      this.query();
    },
  }
}
</script>

<style scoped>

</style>
