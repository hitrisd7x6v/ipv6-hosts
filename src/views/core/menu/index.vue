<template>
  <ivz-menu-view :expand="true" name="菜单">
    <ivz-view-search>
      <ivz-input field="name" label="菜单名称" />
      <ivz-input field="msn" label="所属模块" />
    </ivz-view-search>
    <ivz-view-table :columns="columns" size="small" :pagination="false" />
    <ivz-view-drawer :rules="rules" width="868" layout="vertical" placement="left">
      <a-row :gutter="24">
        <a-col span="8">
          <ivz-input field="name" label="菜单名称"/>
        </a-col>
        <a-col span="8">
          <ivz-tree-select field="pid" label="父菜单" :defaultValue="0"
               url="/core/menu/parent" labelField="name" valueField="id"
               treeNodeFilterProp="label"/>
        </a-col>
        <a-col span="8">
          <ivz-select field="type" label="菜单类型" :options="type" @change="typeHandle"/>
        </a-col>
        <a-col span="8">
          <ivz-select field="msn" label="所属模块" url="/core/msn" labelField="name" valueField="msn"/>
        </a-col>
        <a-col span="8">
          <ivz-input field="url" label="菜单地址"/>
        </a-col>
        <a-col span="8">
          <ivz-input-group label="功能点" compact>
            <template #default="model">
              <a-select :options="permType" defaultValue style="width: 38%" @change="permTypeChange"/>
              <a-input style="width: 62%" v-model:value="model.permType"
                       :readonly="disabledPermType" placeholder="请输入功能点" ref="permTypeRef"/>
            </template>
          </ivz-input-group>
        </a-col>
        <a-col span="8">
          <ivz-select field="position" label="功能位置" :options="position"/>
        </a-col>
        <a-col span="8">
          <ivz-input field="perms" label="权限标识"/>
        </a-col>
        <a-col span="8">
          <ivz-input field="icon" label="图标" />
        </a-col>
        <a-col span="8">
          <ivz-input-number field="sort" label="排序" :defaultValue="80"/>
        </a-col>
      </a-row>
    </ivz-view-drawer>
  </ivz-menu-view>
</template>

<script>
import {FunMetaMaps} from "@/utils/MetaUtils";
import {ref} from "vue";

export default {
  name: "Menu",
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
    let addFunMeta = this.getTableFunMeta(FunMetaMaps.Add);
    if(addFunMeta) {
      // 覆盖表格新增功能点的默认实现
      addFunMeta.callback = (row, meta, {openEditView}) => {
        openEditView(addFunMeta).then(model => {
          model['pid'] = row.id
          if(row.type == 'V') {
            model.type = 'A'
          }
        });
      }

      // 如果是功能类型, 则不能删除
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
      let {validate} = this.getEditContext();

      if(val == 'A') {
        this.rules['position'].required = true;
      } else {
        this.rules['position'].required = false;
      }

      validate('position');
    },
    permTypeChange(val) {
      let editModel = this.getEditModel();
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
