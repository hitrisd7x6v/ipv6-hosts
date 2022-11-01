<template>
  <ivz-func-view :searchFunMetas="searchFunMetas" :editFunMetas="editFunMetas"
                 :tableFunMetas="tableFunMetas" :isExpand="true">
    <IvzPrimarySearch>
      <ivz-input label="部门名称" field="name"/>
    </IvzPrimarySearch>
    <IvzPrimaryTable :columns="columns" :pagination="false" size="small"/>
    <IvzPrimaryModal :rules="rules">
      <ivz-input label="部门名称" field="name"/>
      <ivz-input label="部门负责人" field="leader"/>
      <ivz-input label="负责人邮箱" field="email"/>
      <ivz-input label="负责人手机" field="phone"/>
    </IvzPrimaryModal>
  </ivz-func-view>
</template>
<!--部门管理-->
<script>
import {IvzPrimarySearch, IvzPrimaryTable, IvzPrimaryModal} from "@/components/view";
import {FunMetaMaps} from "@/utils/MetaUtils";

export default {
  name: "Dept",
  components: {IvzPrimaryModal, IvzPrimaryTable, IvzPrimarySearch},
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
      {field: FunMetaMaps.View, name: '搜索', url: '/core/dept/view'},
      {field: FunMetaMaps.Reset, name: '重置'},
      {field: FunMetaMaps.Add, name: '新增', url: '/core/dept/add'},
      {field: FunMetaMaps.Expanded, name: '展开/折叠'}
    ]
    let editFunMetas = [
      {field: FunMetaMaps.Cancel, name: '取消'},
      {field: FunMetaMaps.Submit, name: '提交'},
      {field: FunMetaMaps.Reset, name: '重置'}
    ]
    let tableFunMetas = [
      {field: FunMetaMaps.Edit, name: '修改', url: '/core/dept/edit'},
      {field: FunMetaMaps.Del, name: '删除', url: '/core/dept/del'},
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
