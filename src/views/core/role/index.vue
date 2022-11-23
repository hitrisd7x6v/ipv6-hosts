<template>
  <ivz-menu-view name="角色管理">
    <ivz-primary-search ref="ivzForm">
      <ivz-input label="角色名称" field="name" />
      <ivz-radio label="状态" field="status" :options="status"/>
    </ivz-primary-search>
    <ivz-primary-modal :span="[5, 16]" :rules="rules">
      <ivz-input label="角色名称" field="name" />
      <ivz-radio label="状态" field="status" :options="status" defaultValue="enabled"/>
      <ivz-input-number label="排序" field="sort" :defaultValue="10"/>
      <ivz-textarea label="备注" field="remark" />
      <template #title="{model}">
        {{model.id != null ? '修改角色' : '新增角色'}}
      </template>
    </ivz-primary-modal>
    <ivz-primary-table :columns="columns" :bordered="true" size="small"/>
    <IvzBasicModal id="funcPerm" title="分配功能权限" :bodyStyle="{height: '360px', overflow: 'auto'}">

      &nbsp;<a-button @click="() => expanded('close')">折叠</a-button>
      &nbsp;<a-button type="primary" @click="() => expanded('open')">展开</a-button>

      <a-checkbox style="float: right" v-model:checked="checkedValue" @change="checked">全选</a-checkbox>

      <IvzTree dataUrl="/core/role/allMenus" :checkedUrl="selectedUrl"
           showLine checkable :selectable="false" ref="funcMenus" />
      <template #footer>
        <IvzFuncBtn func="reset" @click="reset">重置</IvzFuncBtn>
        <IvzFuncBtn func="submit" @click="submit">提交</IvzFuncBtn>
        <IvzFuncBtn func="cancel" @click="cancel">取消</IvzFuncBtn>
      </template>
    </IvzBasicModal>
  </ivz-menu-view>
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

  mounted() {
    let tableMeta = this.$view.getTableMeta('FuncPerm');
    if(tableMeta != null) {
      tableMeta.callback = (row) => {
        this.$view.getEditContext("funcPerm").asyncVisible().then(model => {
          model['id'] = row.id
          this.selectedUrl = '/core/role/func?id=' + row.id;
        })
      }
    }
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
