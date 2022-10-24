<template>
  <IvzBasicView>
    <IvzBasicSearch>
      <ivz-select label="字典类型" field="type" />
      <ivz-input label="名称" field="name" />
      <a-button type="primary">查询</a-button>
    </IvzBasicSearch>
    <IvzBasicModal title="新增" :span="[8, 16]">
        <IvzInput field="name" label="名称" />
        <IvzDateTime field="time" label="时间" />
        <IvzInputGroup>
          <a-input style="width: 50%"></a-input>
          <a-select style="width: 50%"></a-select>
        </IvzInputGroup>
        <IvzCheckbox field="sex">性别</IvzCheckbox>
        <IvzRadio field="sex" label="性别" :options="options"></IvzRadio>
      <template #footer>
        <span>sdf</span>
      </template>
    </IvzBasicModal>
    <IvzBasicTable :columns="columns" size="small" :bordered="true"></IvzBasicTable>
  </IvzBasicView>
</template>

<script>
/*字典数据页面*/
import IvzBasicView from "@/components/view/IvzBasicView";
import IvzBasicTable from "@/components/table/IvzBasicTable";
import IvzBasicModal from "@/components/modal/IvzBasicModal";
import IvzBasicSearch from "@/components/search/IvzBasicSearch.vue";
export default {
  name: "DictData",
  components: {IvzBasicModal, IvzBasicSearch, IvzBasicTable, IvzBasicView},
  setup() {
    let options = [
      {label: '男', value: 'man'}
    ]
    let columns = [
      {title: '标签', field: 'label'},
      {title: '字典值', field: 'value'},
      {title: '状态', field: 'status'},
      {title: '备注', field: 'remark'},
    ]
    return {columns, options};
  },
  mounted() {
    this.$view.config.query("").GET()
  }
}
</script>

<style scoped>

</style>
