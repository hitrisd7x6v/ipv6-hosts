<template>
  <IvzBasicView name="角色管理">
    <IvzViewSearch ref="ivzForm">
      <ivz-input label="角色名称" field="name" />
      <ivz-radio label="状态" field="status" :options="status"/>
      <template #func>
        <IvzFuncBtn func="query" url="/core/role/view">搜索</IvzFuncBtn>
        <IvzFuncBtn func="reset">重置</IvzFuncBtn>
        <IvzFuncBtn func="add" url="/core/role/add">新增</IvzFuncBtn>
      </template>
    </IvzViewSearch>
    <IvzViewModal :span="[5, 16]" :rules="rules">
      <ivz-input label="角色名称" field="name" />
      <ivz-radio label="状态" field="status" :options="status" defaultValue="enabled"/>
      <ivz-input-number label="排序" field="sort" :defaultValue="10"/>
      <ivz-textarea label="备注" field="remark" />
      <template #title="{model}">
        {{model.id != null ? '修改角色' : '新增角色'}}
      </template>
      <template #footer="{model}">
        <IvzFuncBtn func="cancel">取消</IvzFuncBtn>
        <IvzFuncBtn func="submit" :url="model.id ? '/core/role/edit' : '/core/role/add'">提交</IvzFuncBtn>
        <IvzFuncBtn func="reset">重置</IvzFuncBtn>
      </template>
    </IvzViewModal>
    <IvzViewTable :columns="columns" :bordered="true" size="small">
      <template #c_action="{record}">
        <IvzFuncTag func="edit" :data="record" url="/core/role/edit">修改</IvzFuncTag>
        <IvzFuncTag func="del" :data="record" url="/core/role/del">删除</IvzFuncTag>
        <IvzFuncTag func="edit:funcPerm" :data="record" url="/core/role/del" color="grey">分配权限</IvzFuncTag>
      </template>
    </IvzViewTable>
    <IvzBasicModal id="funcPerm" title="分配功能权限" :bodyStyle="{height: '360px', overflow: 'auto'}">

      &nbsp;<a-button @click="() => expanded('close')">折叠</a-button>
      &nbsp;<a-button type="primary" @click="() => expanded('open')">展开</a-button>

      <a-checkbox style="float: right" v-model:checked="checkedValue" @change="checked">全选</a-checkbox>

      <IvzTree dataUrl="/core/role/allMenus" :checkedUrl="selectedUrl"
           showLine checkable :selectable="false" ref="funcMenus" />
      <template #footer>
        <IvzFuncBtn func="reset" @click="reset">重置</IvzFuncBtn>
        <IvzFuncBtn func="submit" url="/core/role/perm">提交</IvzFuncBtn>
        <IvzFuncBtn func="cancel">取消</IvzFuncBtn>
      </template>
    </IvzBasicModal>
  </IvzBasicView>
</template>

<script>
import {ref} from "vue";

export default {
  name: "Role",
  setup() {
    let status = [
      {label: '启用', value: 'enabled'}, {label: '禁用', value: 'disabled'}
    ]
    let columns = [
      {field: 'name', title: '名称'},
      {field: 'status', title: '状态', options: status},
      {field: 'sort', title: '排序'},
      {field: 'remark', title: '备注'},
      {field: 'createTime', title: '创建时间', type: 'datetime', picker: 'date'},
      {field: 'action', title: '操作', type: 'action'}
    ]
    let rules = {
      name: {required: true, message: '角色名称必填'}
    }

    let selectedUrl = ref('');
    let filterValue = ref('');
    let checkedValue = ref(false);

    return {columns, rules, status, selectedUrl, filterValue, checkedValue}
  },

  methods: {
    reset() {
      this.filterValue = '';
      this.checkedValue = false;
      this.$refs['funcMenus'].loadingCheckedData(this.selectedUrl);
    },
    submit() {
      let model = this.$view.getEditContext("funcPerm").getModel();
      model['menuIds'] = this.$refs['funcMenus'].getCheckedKeys();

      this.$view.getEditContext("funcPerm")
          .submit('/core/role/perm');
    },
    cancel() {
      this.$view.getEditContext("funcPerm").cancel();
    },
    checked(e) {
      if(e.target.checked) {
        this.$refs['funcMenus'].setCheckedKeys();
      } else {
        this.$refs['funcMenus'].setCheckedKeys([]);
      }
    },
    expanded(type) {
      if(type == 'open') {
        this.$refs['funcMenus'].setExpandedKeys();
      } else {
        this.$refs['funcMenus'].setExpandedKeys([])
      }
    }
  }
}
</script>

<style scoped>

</style>
