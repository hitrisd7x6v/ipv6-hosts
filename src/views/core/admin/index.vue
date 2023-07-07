<template>
  <UView name="用户">
    <UViewSearch bread>
      <URow col="search">
        <UInput field="name" label="用户昵称"/>
        <UInput field="account" label="用户帐号"/>
        <UInput field="phone" label="用户手机"/>
        <UTreeSelect field="orgId" label="所属部门" url="/core/org/parent"
                     labelField="name" valueField="id"/>
        <URadio field="status" label="用户状态" dict="sys_func_status"/>
        <UFuncBtn func="query" url="/core/admin/view">搜索</UFuncBtn>
        <UFuncBtn func="reset">重置</UFuncBtn>
      </URow>
      <template #func>
        <UFuncBtn func="add" v-auth="'core:admin:add'">新增</UFuncBtn>
      </template>
    </UViewSearch>
    <UViewDrawer width="780" layout="vertical" :rules="rules" placement="left" title="用户管理">
      <template #default="{model}">
        <URow :gutter="16" col="drawer">
          <UInput field="account" label="用户帐号" :disabled="model.id != null"/>
          <UInput field="name" label="用户昵称" required/>
          <UTreeSelect field="orgId" label="所属部门" treeNodeFilterProp="label"
                           url="/core/org/parent" labelField="name" valueField="id"/>
          <UInput field="email" label="用户邮箱" />
          <URadio field="status" label="用户状态" defaultValue="enabled" dict="sys_func_status"/>
          <URadio field="sex" label="用户性别" :options="sex" defaultValue="non"/>
          <UCheckbox field="roleIds" label="用户角色" url="/core/role/list"
                        labelField="name" valueField="id" :span="24"/>
          <UTextarea field="remark" label="用户简介" :span="24" />
        </URow>
      </template>
      <template #footer="{model}">
        <UFuncBtn func="cancel">取消</UFuncBtn>
        <UFuncBtn func="submit" :url="model.id ? '/core/admin/edit' : '/core/admin/add'">提交</UFuncBtn>
        <UFuncBtn func="reset">重置</UFuncBtn>
      </template>
    </UViewDrawer>
    <UViewTable :columns="columns" :scroll="{x: 1000}">
      <template #action="{record}">
        <UFuncTag func="edit" :data="record" url="/core/admin/edit">修改</UFuncTag>
        <UFuncTag func="del" :data="record" url="/core/admin/del">删除</UFuncTag>
        <UFuncTag func="edit:set" eid="modPwd" :data="record"
                  :config="{copy: ['id']}" url="/core/admin/pwd">设置密码</UFuncTag>
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

import {reactive, ref} from "vue";
import ULinkView from "@/components/view/LinkView";

export default {
  name: "Admin",
  components: {ULinkView},
  setup() {
    let sex = [
      {label: '男', value: 'man'},
      {label: '女', value: 'woman'},
      {label: '保密', value: 'non'}
    ]

    let columns = reactive([
      {title: '用户账号', field: 'account', fixed: 'left', width: 150},
      {title: '用户昵称', field: 'name', width: 150},
      {title: '所属部门', field: 'orgId', url: '/core/org/parent'
        , valueField: 'id', labelField: 'name', width: 120, ellipsis: true},
      {title: '性别', field: 'sex', options: sex, width: 60},
      {title: '手机', field: 'phone', width: 110},
      {title: '邮箱', field: 'email', ellipsis: true, width: 130},
      {title: '状态', field: 'status', dict: 'sys_func_status', width: 60},
      {title: '创建时间', field: 'createTime', width: 160},
      {title: '操作', field: 'action', type: 'action', width: 200},
    ])

    let rules = {
      name: {required: true, message: '用户昵称必填'},
      roleIds: {type: 'array', required: true, message: '请选择用户角色'},
      account: {required: true, message: '用户帐号必填'},
    }

    let pwdModel = ref({password: null, surePwd: null});
    let validator = (a,b,c) => {
      return new Promise((resolve, reject) => {
        if(b == null || b == '') {
          reject("请输入确认密码");
        } else if(pwdModel.value.password != pwdModel.value.surePwd) {
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

    return {columns, rules, status, sex, pwdRules, pwdModel}
  }
}
</script>

<style scoped>

</style>
