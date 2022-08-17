<template>
  <ivz-func-view :searchFunMetas="searchFunMetas" :isExpand="true">
    <ivz-view-search>
      <ivz-input label="部门名称" field="name"/>
    </ivz-view-search>
    <ivz-view-table :columns="columns" :pagination="false" size="small"/>
    <ivz-view-modal>

    </ivz-view-modal>
  </ivz-func-view>
</template>
<!--部门管理-->
<script>
import IvzMenuView from "@/components/view/IvzMenuView.vue";
import {IvzViewSearch, IvzViewTable, IvzViewModal} from "@/components/view";
import {ref} from "vue";
export default {
  name: "Dept",
  components: {IvzViewModal, IvzViewTable, IvzViewSearch, IvzMenuView},
  setup() {
    let columns = [
      {field: 'name', title: '部门名称', align: 'left'},
      {field: 'leader', title: '部门负责人'},
      {field: 'email', title: '负责人邮箱'},
      {field: 'phone', title: '负责人手机号'},
      {field: 'createTime', title: '创建时间'},
      {field: 'action', type:'action', title: '操作'},
    ]
    let searchFunMetas = [
      {field: 'View', name: '搜索', url: '/core/dept/view'}
    ]
    let expandedRowKeys = ref([1, 2]);
    return {columns, searchFunMetas, expandedRowKeys};
  },
  methods: {
    changeHandle() {
      this.expandedRowKeys = [1, 5]
    }
  }
}
</script>

<style scoped>

</style>
