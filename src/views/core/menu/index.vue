<template>
  <UView name="菜单" auth>
    <UViewSearch bread>
      <UInput field="name" label="菜单名称" :allowClear="true" />
      <USelect field="status" label="状态" dict="sys_func_status"/>
      <USelect field="type" label="菜单类型" :options="type" :allowClear="true"/>
      <UFuncBtn func="query" url="/core/menu/view">搜索</UFuncBtn>
      <UFuncBtn func="reset">重置</UFuncBtn>
      <template #func>
        <UFuncBtn func="add" v-auth="'core:menu:add'">新增</UFuncBtn>
        <UFuncBtn func="expand">展开/缩收</UFuncBtn>
      </template>
    </UViewSearch>
    <UViewTable :columns="columns" :pagination="false" :scroll="{x: 900}">
      <template #action="{record}">
        <UFuncTag func="add:child" :data="record" v-auth="'core:menu:add'"
                  :disabled="disabled(record)" :config="{pid: 'pid'}">新增子菜单</UFuncTag>
        <UFuncTag func="edit" :data="record" url="/core/menu/edit">修改</UFuncTag>
        <UFuncTag func="del" :data="record" url="/core/menu/del">删除</UFuncTag>
      </template>
    </UViewTable>
    <UViewDrawer :rules="rules" v-model="model" width="780" title="菜单管理"
                 layout="vertical" placement="left" @edit="edit">
      <URow :gutter="24" span="8">
        <UInput field="name" label="菜单名称" />
        <UTreeSelect field="pid" label="父菜单" :defaultValue="0"
             url="/core/menu/parent" labelField="name" valueField="id"
             treeNodeFilterProp="label"/>
        <USelect field="type" label="菜单类型" :options="type"/>
        <UInput field="url" label="菜单URL"/>
        <URadio field="status" label="状态" dict="sys_func_status"/>
        <UInput field="perms" label="权限标识" />
        <UInput field="icon" label="图标" />
        <UInputNumber field="sort" label="排序" />
        <URadio field="log" label="日志采集" :options="BooleanStatus" :defaultValue="true"/>
      </URow>
      <template #footer="{model}">
        <UFuncBtn func="cancel">取消</UFuncBtn>
        <UFuncBtn func="submit" :url="model && model.id ? '/core/menu/edit' : '/core/menu/add'">提交</UFuncBtn>
        <UFuncBtn func="reset">重置</UFuncBtn>
      </template>
    </UViewDrawer>
  </UView>
</template>

<script>
import {BooleanStatus} from "@/utils/StatusConsts";
import {reactive, ref} from "vue";

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

    const columns = reactive([
      {field: 'name', title: '菜单名称', align: 'left', width: 180},
      {field: 'type', title: '菜单类型', options: type, width: 80},
      {field: 'url', title: '菜单URL', resizable: true, width: 100},
      {field: 'perms', title: '权限标识'},
      {field: 'status', title: '菜单状态', dict: 'sys_func_status'},
      {field: 'createTime', title: '创建时间', type: 'date', format: 'YYYY-MM-DD'},
      {field: 'action', title: '操作', type: 'action', width: 210},
    ])
    let rules = {
      pid: {type: 'number', required: true},
      name: {required: true, message: '菜单名称'},
      msn: {required: true, message: '所属模块必填'},
      type: {required: true, message: '菜单类型必填'},
    }

    let model = {sort: 68}
    let disabledPermType = ref(false);
    return {columns, rules, position, type, disabledPermType, BooleanStatus, model}
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
