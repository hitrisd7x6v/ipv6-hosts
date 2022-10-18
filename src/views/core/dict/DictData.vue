<template>
  <IvzBasicView>
    <IvzBasicSearch>
      <ivz-select label="字典类型" field="type" />
      <ivz-input label="名称" field="name" />
      <a-button type="primary">查询</a-button>
    </IvzBasicSearch>
    <IvzBasicModal title="新增">
      <IvzInput field="name" label="名称"/>
      <template #footer>
        <span>sdf</span>
      </template>
    </IvzBasicModal>
    <IvzBasicTable :columns="columns" size="small" :bordered="true"></IvzBasicTable>
  </IvzBasicView>
</template>

<script>
/*字典数据页面*/
import IvzBasicView from "@/components/view/IvzBasicView.vue";
import IvzBasicTable from "@/components/table/IvzBasicTable";
import IvzBasicSearch from "@/components/search/IvzBasicSearch.vue";
import IvzBasicModal from "@/components/modal/IvzBasicModal";
export default {
  name: "DictData",
  components: {IvzBasicModal, IvzBasicSearch, IvzBasicTable, IvzBasicView},
  props: ["a", "b", "c"],
  setup() {
    let columns = [
      {title: '标签', field: 'label'},
      {title: '字典值', field: 'value'},
      {title: '状态', field: 'status'},
      {title: '备注', field: 'remark'},
    ]
    return {columns};
  },
  mounted() {
    this.$actions.ExecQuery()
  }
}
</script>

<style scoped>

</style>
