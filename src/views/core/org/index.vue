<template>
  <ivz-menu-view name="部门" :expand="true">
    <ivz-primary-search>
      <ivz-input field="name"/>
    </ivz-primary-search>
    <ivz-primary-table :columns="columns" size="small">

    </ivz-primary-table>
    <ivz-primary-modal :span="[7, 15]" :rules="rules">
      <ivz-input field="name" label="部门名称"/>
      <ivz-tree-select field="pid" label="所属部门" valueField="id"
         :defaultValue="0" url="/core/org/parent" labelField="name"
         treeNodeFilterProp="label"/>
      <ivz-input field="leader" label="部门负责人"/>
      <ivz-input field="phone" label="负责人手机号"/>
    </ivz-primary-modal>
  </ivz-menu-view>
</template>
<!--部门管理-->
<script>
import {FunMetaMaps} from "@/utils/MetaUtils";

export default {
  name: "Dept",
  setup() {
    let columns = [
      {field: 'name', title: '部门名称', align: 'left'},
      {field: 'leader', title: '部门负责人'},
      {field: 'phone', title: '负责人手机号'},
      {field: 'createTime', title: '创建时间'},
      {field: 'action', type:'action', title: '操作'},
    ]

    let rules = {
      name: {required: true, message: '部门名称必填'},
      pid: {type: 'number', required: true, message: '请选择所属部门'},
    }

    return {columns, rules}
  },
  mounted() {
    // 表格组件添加子部门
    let addFunMeta = this.getTableFunMeta(FunMetaMaps.Add);
    if(addFunMeta) {
      addFunMeta.name = "新增子部门"
      addFunMeta.callback = (row, meta) => {
        // 打开编辑视图
        this.$view.openForAdd(model=>{
          model.pid = row.id;
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
