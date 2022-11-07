<template>
  <IvzBasicView>
    <IvzBasicSearch primary>
      <ivz-select label="字典类型" field="type" @change="loadDictData" span="5"
                  url="/core/dictType/list" labelField="name" valueField="type"/>
      <ivz-input label="名称" field="name" />
      <a-button type="primary" @click="query">查询</a-button>&nbsp;
      <a-button @click="add">新增</a-button>&nbsp;
    </IvzBasicSearch>
    <IvzBasicDrawer title="新增" :span="[6, 16]" primary :rules="rules">
        <IvzInput field="type" label="字典类型" disabled/>
        <IvzInput field="label" label="字典标签" />
        <IvzInput field="value" label="标签值" />
        <IvzInputNumber field="sort" label="排序" :defaultValue="10"/>
      <template #footer>
        <IvzFuncBtn func="cancel" @click="cancel">取消</IvzFuncBtn>
        <IvzFuncBtn func="submit" @click="submit">提交</IvzFuncBtn>&nbsp;
        <IvzFuncBtn func="reset" @click="resetEdit">重置</IvzFuncBtn>&nbsp;
      </template>
    </IvzBasicDrawer>
    <IvzBasicTable :columns="columns" size="small" rowKey="id"
             :bordered="true" primary :pagination="false">
      <template #c_action="{record}">
        <IvzFuncTag func="edit" :data="record" @handle="editRow">编辑</IvzFuncTag>
        <IvzFuncTag func="del" :data="record" @handle="delRow">删除</IvzFuncTag>
      </template>
    </IvzBasicTable>
  </IvzBasicView>
</template>

<script>
/*字典数据页面*/
import IvzBasicView from "@/components/view/IvzBasicView";
import IvzBasicTable from "@/components/table/IvzBasicTable";
import IvzBasicSearch from "@/components/search/IvzBasicSearch.vue";
import {IvzInput} from "@/components/form/basic";
import {IvzFuncBtn, IvzFuncTag} from "@/components/basic";
import IvzBasicDrawer from "@/components/drawer/IvzBasicDrawer";

export default {
  name: "DictData",
  components: {
    IvzBasicDrawer, IvzFuncBtn, IvzFuncTag, IvzInput
    , IvzBasicSearch, IvzBasicTable, IvzBasicView},
  setup() {
    let status = [
      {label: '启用', value: 'enabled'},
      {label: '禁用', value: 'disabled'},
    ]

    let columns = [
      {title: '字典类型', field: 'type'},
      {title: '字典标签', field: 'label'},
      {title: '标签值', field: 'value'},
      {title: '状态', field: 'status', options: status},
      {title: '排序', field: 'sort'},
      {title: '备注', field: 'remark'},
      {title: '操作', field: 'action', type: 'action'},
    ]

    let rules = {
      label: {required: true, message: '字典标签必填'},
      value: {required: true, message: '标签值必填'},
    }

    return {columns, status, rules};
  },
  mounted() {
    let model = this.$view.getSearchModel();
    model.type = this.$route.query.type;

    this.query();
  },
  methods: {
    query() {
      this.$view.query("/core/dictData/view");
    },

    add() {
      this.$view.openForAdd(model => model.type = this.$view.getSearchContext().getModel().type);
    },

    submit() {
      this.$view.submit("/core/dictData/add").then(() => this.query());
    },

    delRow(row) {
      this.$view.del("/core/dictData/del", [row.id]).then(() => this.query());
    },

    editRow(row) {
      let id = row.id;
      this.$view.openForEdit(`/core/dictData/edit`, {id});
    },
    cancel() {
      this.$view.cancel();
    },
    resetEdit() {
      this.$view.resetEditModel();
    },
    loadDictData() {
      this.query();
    },
  }
}
</script>

<style scoped>

</style>
