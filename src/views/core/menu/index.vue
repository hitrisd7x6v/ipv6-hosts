<template>
  <ivz-menu-view :expand="true" name="菜单">
    <IvzPrimarySearch>
      <ivz-input field="name" label="菜单名称" />
      <ivz-input field="msn" label="所属模块" />
    </IvzPrimarySearch>
    <IvzPrimaryTable :columns="columns" size="small" :pagination="false" />
    <IvzPrimaryDrawer :rules="rules" width="868" layout="vertical" placement="left">
      <IvzRow :gutter="24" span="8">
        <ivz-input field="name" label="菜单名称" />
        <ivz-tree-select field="pid" label="父菜单" :defaultValue="0"
             url="/core/menu/parent" labelField="name" valueField="id"
             treeNodeFilterProp="label"/>
        <ivz-select field="type" label="菜单类型" :options="type" @change="typeHandle"/>
        <ivz-select field="msn" label="所属模块" url="/core/msn" labelField="name" valueField="msn"/>
        <ivz-input field="url" label="菜单地址"/>
        <ivz-input-group label="功能点" compact field="permType">
          <template #default="model">
            <a-select :options="permType" defaultValue style="width: 38%" @change="permTypeChange"/>
            <a-input style="width: 62%" v-model:value="model.permType"
                     :readonly="disabledPermType" placeholder="请输入功能点" ref="permTypeRef"/>
          </template>
        </ivz-input-group>
        <ivz-select field="position" label="功能位置" :options="position"/>
        <ivz-input field="perms" label="权限标识" />
        <ivz-input field="icon" label="图标" />
        <ivz-input-number field="sort" label="排序" :defaultValue="80" />
      </IvzRow>
    </IvzPrimaryDrawer>
  </ivz-menu-view>
</template>

<script>
import {FunMetaMaps} from "@/utils/MetaUtils";
import {ref} from "vue";
import {IvzRow} from "@/components/basic";
import {IvzPrimarySearch, IvzPrimaryTable, IvzPrimaryDrawer} from "@/components/view";

export default {
  name: "Menu",
  components: {IvzPrimaryDrawer, IvzPrimaryTable, IvzPrimarySearch, IvzRow},
  setup() {
    let type = [
      {label: '目录', value: 'M'},
      {label: '视图', value: 'V'},
      {label: '功能', value: 'A'},
    ]
    let permType = [
      {label: '新增', value: FunMetaMaps.Add},
      {label: '删除', value: FunMetaMaps.Del},
      {label: '编辑', value: FunMetaMaps.Edit},
      {label: '搜索', value: FunMetaMaps.View},
      {label: '详情', value: FunMetaMaps.Detail},
      {label: '导入', value: FunMetaMaps.Import},
      {label: '导出', value: FunMetaMaps.Export},
      {label: '自定义', value: ''},
    ]

    let position = [
      {label: '全部', value: 'AM'},
      {label: '搜索栏', value: 'M'},
      {label: '表格栏', value: 'T'},
    ];

    const columns = [
      {field: 'name', title: '菜单名称', align: 'left'},
      {field: 'url', title: '访问路径'},
      {field: 'type', title: '菜单类型', options: type},
      {field: 'msn', title: '所属模块',  url: "/core/msn", labelField: 'name', valueField: 'msn'},
      {field: 'perms', title: '权限标识'},
      {field: 'permType', title: '功能点', options: permType},
      {field: 'position', title: '功能位置', options: position},
      {field: 'createTime', title: '创建时间', type: 'datetime'},
      {field: 'action', title: '操作', type: 'action'},
    ]
    let rules = {
      pid: {type: 'number', required: true},
      name: {required: true, message: '菜单名称'},
      type: {required: true, message: '菜单类型必填'},
      position: {required: false, message: '功能位置必填'},
    }

    let disabledPermType = ref(false);
    return {columns, permType, rules, position, type, disabledPermType}
  },
  mounted() {
    let addFunMeta = this.$view.getMetaContext()
        .getTableMeta(FunMetaMaps.Add);

    if(addFunMeta) {
      // 覆盖表格新增功能点的默认实现
      addFunMeta.callback = (row, meta) => {
        this.$view.openForAdd((model) => {
          model['pid'] = row.id
          if(row.type == 'V') {
            model.type = 'A'
          }
        })
      }

      addFunMeta.disabled = (row) => {
        if(row['type'] == 'A') {
          return true;
        }
        return false;
      }
    }
  },
  methods: {
    typeHandle(val) {
      let {validate} = this.$view.getEditContext().getFormContext();

      if(val == 'A') {
        this.rules['position'].required = true;
      } else {
        this.rules['position'].required = false;
      }

      validate('position');
    },
    permTypeChange(val) {
      let editModel = this.$view.getEditContext().getModel();
      editModel['permType'] = val;
      if(val == '') {
        this.disabledPermType = false;
        this.$refs['permTypeRef'].focus();
      } else {
        this.disabledPermType = true;
      }
    }
  }
}
</script>

<style scoped>

</style>
