<template>
  <IvzBasicView>
    <IvzBasicSearch primary>
      <ivz-select label="字典类型" field="type" @change="loadDictData" :clear="true"
                  url="/core/dictType/list" labelField="name" valueField="type"/>
      <ivz-input label="名称" field="name" />
      <a-button type="primary" @click="query">查询</a-button>&nbsp;
      <a-button @click="add">新增</a-button>&nbsp;
<!--      <a-button @click="resetSearch">重置</a-button>-->
    </IvzBasicSearch>
    <IvzBasicModal title="新增" :span="[6, 16]" primary :rules="rules">
        <IvzInput field="type" label="字典类型" disabled />
        <IvzInput field="label" label="字典标签" />
        <IvzInput field="value" label="标签值" />
        <IvzInputNumber field="sort" label="排序" :defaultValue="10"/>
      <template #footer>
        <IvzFuncBtn type="cancel" @click="cancel">取消</IvzFuncBtn>
        <IvzFuncBtn type="submit" @click="submit">提交</IvzFuncBtn>&nbsp;
        <IvzFuncBtn type="reset" @click="resetEdit">重置</IvzFuncBtn>&nbsp;
      </template>
    </IvzBasicModal>
    <IvzBasicTable :columns="columns" size="small" :bordered="true" primary :pagination="false">
      <template #c_action="{record}">
        <IvzFuncTag type="edit" :data="record" @handle="editRow">编辑</IvzFuncTag>
        <IvzFuncTag type="del" :data="record" @handle="delRow">删除</IvzFuncTag>
      </template>
    </IvzBasicTable>
  </IvzBasicView>
</template>

<script>
/*字典数据页面*/
import IvzBasicView from "@/components/view/IvzBasicView";
import IvzBasicTable from "@/components/table/IvzBasicTable";
import IvzBasicModal from "@/components/modal/IvzBasicModal";
import IvzBasicSearch from "@/components/search/IvzBasicSearch.vue";
import {IvzInput} from "@/components/form/basic";
import {IvzFuncBtn, IvzFuncTag} from "@/components/basic";
export default {
  name: "DictData",
  components: {IvzFuncBtn, IvzFuncTag, IvzInput, IvzBasicModal, IvzBasicSearch, IvzBasicTable, IvzBasicView},
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
    let type = this.$route.query.type;
    let model = this.$view.getSearchContext().getModel();
    model.type = type
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
