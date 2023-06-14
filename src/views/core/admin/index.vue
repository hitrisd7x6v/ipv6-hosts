<template>
  <UView name="用户">
    <UViewSearch type="bread">
      <URow span="6">
        <UInput field="name" label="用户昵称" />
        <UInput field="account" label="用户帐号" />
        <UInput field="phone" label="用户手机" />
        <URadio field="status" label="用户状态" :options="status"/>
      </URow>
      <template #func>
        <UFuncBtn func="reset">重置</UFuncBtn>
        <UFuncBtn func="query" url="/core/admin/view">搜索</UFuncBtn>
        <UFuncBtn func="add" v-auth="'core:admin:add'">新增</UFuncBtn>
      </template>
    </UViewSearch>
    <UViewDrawer width="860" layout="vertical" :rules="rules" placement="left">
      <template #default="{model}">
        <URow :gutter="16" span="8">
          <UInput field="name" label="用户昵称" />
          <UInput field="account" label="用户帐号" :disabled="model.id != null"/>
          <UTreeSelect field="orgId" label="所属部门" treeNodeFilterProp="label"
                           url="/core/org/parent" labelField="name" valueField="id" :virtual="false"/>
          <UInput field="email" label="用户邮箱" />
          <URadio field="status" label="用户状态" defaultValue="enabled" :options="status"/>
          <URadio field="sex" label="用户性别" :options="sex" defaultValue="non"/>
          <UCheckbox field="roleIds" label="用户角色" url="/core/role/list"
                        labelField="name" valueField="id" span="24"/>
          <UTextarea field="remark" label="用户简介" span="24" />
        </URow>
      </template>
      <template #title="{model}">
        {{model.id != null ? '修改用户' : '新增用户'}}
      </template>
      <template #footer="{model}">
        <UFuncBtn func="cancel">取消</UFuncBtn>
        <UFuncBtn func="submit" :url="model.id ? '/core/admin/edit' : '/core/admin/add'">提交</UFuncBtn>
        <UFuncBtn func="reset">重置</UFuncBtn>
      </template>
    </UViewDrawer>
    <UViewTable :columns="columns" :bordered="true" size="small">
      <template #action="{record}">
        <UFuncTag func="edit" :data="record" url="/core/admin/edit">修改</UFuncTag>
        <UFuncTag func="del" :data="record" url="/core/admin/del">删除</UFuncTag>
        <UFuncTag func="edit:set" toUid="modPwd" :data="record"
                  :params="{copy: ['id']}" url="/core/admin/pwd">设置密码</UFuncTag>
      </template>
    </UViewTable>
    <!--  修改密码  -->
    <UFormModal uid="modPwd" v-model="pwdModel" title="修改密码" :span="[6, 15]" :rules="pwdRules">
      <UInputPassword label="密码" field="password" />
      <UInputPassword label="确认密码" field="surePwd" />
      <template #footer>
        <UFuncBtn func="submit" url="/core/admin/pwd">提交</UFuncBtn>
        <UFuncBtn func="cancel">取消</UFuncBtn>
      </template>
    </UFormModal>
  </UView>
</template>

<script>

import {ref} from "vue";

export default {
  name: "Admin",
  setup() {
    let sex = [
      {label: '男', value: 'man'},
      {label: '女', value: 'woman'},
      {label: '无', value: 'non'}
    ]

    let status = [
      {label: '启用', value: 'enabled'}, {label: '禁用', value: 'disabled'}
    ]

    let columns = [
      {title: '用户昵称', field: 'name'},
      {title: '用户账号', field: 'account'},
      {title: '所属部门', field: 'orgId', url: '/core/org/parent', valueField: 'id', labelField: 'name'},
      {title: '性别', field: 'sex', options: sex},
      {title: '手机', field: 'phone'},
      {title: '邮箱', field: 'email'},
      {title: '状态', field: 'status', options: status},
      {title: '创建时间', field: 'createTime'},
      {title: '操作', field: 'action', type: 'action'},
    ]

    let rules = {
      name: {required: true, message: '用户昵称必填'},
      roleIds: {type: 'array', required: true, message: '请选择用户角色'},
      account: {required: true, message: '用户帐号必填'},
    }

    let pwdModel = ref({});
    let validator = (a,b,c) => {
      debugger
      return new Promise((resolve, reject) => {
        if(b == null || b == '') {
          reject("请输入确认密码");
        } else if(pwdModel.password != pwdModel.surePwd) {
          reject("两次密码不一致");
        }else {
          resolve();
        }
      })
    }
    let pwdRules = {
      surePwd: {required: true, validator},
      password: {required: true, message: '请输入密码'}
    }

    let loading = ref(false);
    return {columns, rules, status, sex, pwdRules, loading, pwdModel}
  },
}
</script>

<style scoped>

</style>
