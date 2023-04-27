<template>
  <IvzBasicView name="菜单" auth>
    <IvzViewSearch>
      <IvzRow span="6" style="width: 100%">
        <IvzInput field="name" label="菜单名称" :allowClear="true" />
        <IvzSelect field="type" label="菜单类型" :options="type" :allowClear="true"/>
        <IvzSelect field="msn" label="所属模块" :allowClear="true" url="/core/msn" labelField="msn" valueField="msn"/>
      </IvzRow>
      <template #func>
        <IvzFuncBtn func="query" url="/core/menu/view">搜索</IvzFuncBtn>
        <IvzFuncBtn func="reset">重置</IvzFuncBtn>
        <IvzFuncBtn func="add" url="/core/menu/add">新增</IvzFuncBtn>
        <IvzFuncBtn func="expand">展开/缩收</IvzFuncBtn>
      </template>
    </IvzViewSearch>
    <IvzViewTable :columns="columns" size="small" :pagination="false">
      <template #c_action="{record}">
        <IvzFuncTag func="add:child" :data="record" url="/core/menu/add" :disabled="disabled(record)">新增子菜单</IvzFuncTag>
        <IvzFuncTag func="edit" :data="record" url="/core/menu/edit">修改</IvzFuncTag>
        <IvzFuncTag func="del" :data="record" url="/core/menu/del">删除</IvzFuncTag>
      </template>
    </IvzViewTable>
    <IvzViewDrawer :rules="rules" width="780" layout="vertical" placement="left" @edit="edit">
      <IvzRow :gutter="24" span="8">
        <IvzInput field="name" label="菜单名称" />
        <IvzTreeSelect field="pid" label="父菜单" :defaultValue="0"
             url="/core/menu/parent" labelField="name" valueField="id"
             treeNodeFilterProp="label"/>
        <IvzSelect field="type" label="菜单类型" :options="type"/>
        <IvzAutoComplete field="msn" label="所属模块" url="/core/msn" labelField="msn" valueField="msn"/>
        <IvzInput field="url" label="菜单URL"/>
        <IvzInput field="perms" label="权限标识" />
        <IvzInput field="icon" label="图标" />
        <IvzInputNumber field="sort" label="排序" :defaultValue="68" />
        <IvzRadio field="log" label="日志采集" :options="BooleanStatus" :defaultValue="true"/>
      </IvzRow>
      <template #title="{model}">
        {{model.id != null ? '修改菜单' : '新增菜单'}}
      </template>
      <template #footer="{model}">
        <IvzFuncBtn func="cancel">取消</IvzFuncBtn>
        <IvzFuncBtn func="submit" :url="model.id ? '/core/menu/edit' : '/core/menu/add'">提交</IvzFuncBtn>
        <IvzFuncBtn func="reset">重置</IvzFuncBtn>
      </template>
    </IvzViewDrawer>
  </IvzBasicView>
</template>

<script>
import {BooleanStatus} from "@/utils/StatusConsts";
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

    let position = [
      {label: '全部', value: 'AM'},
      {label: '搜索栏', value: 'M'},
      {label: '表格栏', value: 'T'},
    ];

    const columns = [
      {field: 'name', title: '菜单名称', align: 'left'},
      {field: 'url', title: '菜单URL'},
      {field: 'type', title: '菜单类型', options: type},
      {field: 'msn', title: '所属模块',  url: "/core/msn", labelField: 'msn', valueField: 'msn'},
      {field: 'perms', title: '权限标识'},
      // {field: 'permType', title: '功能点', options: permType},
      // {field: 'position', title: '功能位置', options: position},
      {field: 'createTime', title: '创建时间', type: 'datetime'},
      {field: 'action', title: '操作', type: 'action', width: 210},
    ]
    let rules = {
      pid: {type: 'number', required: true},
      name: {required: true, message: '菜单名称'},
      msn: {required: true, message: '所属模块必填'},
      type: {required: true, message: '菜单类型必填'},
    }

    let disabledPermType = ref(false);
    return {columns, rules, position, type, disabledPermType, BooleanStatus}
  },
  mounted() { },
  methods: {
    edit(model, row) {
      if(row && row.type == 'V') { // 视图类型下面必须是功能
        model.type = 'A';
      }
      // 使用当前编辑行的模块
      if(row && row['msn']) {
        model['msn'] = row['msn'];
      }
    },
    disabled(record) {
      return record.type == 'A';
    }
  }
}
</script>

<style scoped>

</style>
