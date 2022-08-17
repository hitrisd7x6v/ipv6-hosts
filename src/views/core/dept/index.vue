<template>
  <ivz-func-view :searchFunMetas="searchFunMetas" :editFunMetas="editFunMetas"
                 :tableFunMetas="tableFunMetas" :isExpand="true">
    <ivz-view-search>
      <ivz-input label="部门名称" field="name"/>
    </ivz-view-search>
    <ivz-view-table :columns="columns" :pagination="false" size="small"/>
    <ivz-view-modal :rules="rules">
      <ivz-input label="部门名称" field="name"/>
      <ivz-input label="部门负责人" field="leader"/>
      <ivz-input label="负责人邮箱" field="email"/>
      <ivz-input label="负责人手机" field="phone"/>
    </ivz-view-modal>
  </ivz-func-view>
</template>
<!--部门管理-->
<script>
import IvzMenuView from "@/components/view/IvzMenuView.vue";
import {IvzViewSearch, IvzViewTable, IvzViewModal} from "@/components/view";
import {ref} from "vue";
import {FunMetaMaps} from "@/utils/SysUtils";
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
      {field: FunMetaMaps.Add, name: '新增', url: '/core/dept/add'},
      {field: FunMetaMaps.View, name: '搜索', url: '/core/dept/view'},
      {field: FunMetaMaps.Reset, name: '重置'}
    ]
    let editFunMetas = [
      {field: FunMetaMaps.Cancel, name: '取消'},
      {field: FunMetaMaps.Submit, name: '提交'},
      {field: FunMetaMaps.Reset, name: '重置'}
    ]
    let tableFunMetas = [
      {field: FunMetaMaps.Del, name: '删除', url: '/core/dept/del'},
      {field: FunMetaMaps.Edit, name: '修改', url: '/core/dept/edit'},
    ]
    let rules = {
      name: {required: true, message: '部门名称必填'}
    }

    return {columns, searchFunMetas, editFunMetas, tableFunMetas, rules};
  },
}
</script>

<style scoped>

</style>
