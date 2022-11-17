<template>
  <ivz-menu-view name="用户">
    <IvzPrimarySearch>
      <ivz-input field="name" label="用户昵称" />
      <ivz-input field="account" label="用户帐号" />
      <ivz-input field="phone" label="用户手机" />
      <ivz-radio field="status" label="用户状态" :options="status"/>
    </IvzPrimarySearch>
    <IvzPrimaryDrawer width="860" layout="vertical" :rules="rules" placement="left">
      <template #default="{model}">
        <IvzRow :gutter="16" span="8">
          <ivz-input field="name" label="用户昵称" />
          <ivz-input field="account" label="用户帐号" :disabled="model.id != null"/>
          <ivz-tree-select field="orgId" label="所属部门" treeNodeFilterProp="label" url="/core/org/parent" labelField="name" valueField="id"/>
          <ivz-input field="email" label="用户邮箱" />
          <ivz-radio field="status" label="用户状态" defaultValue="enabled" :options="status"/>
          <ivz-radio field="sex" label="用户性别" :options="sex" defaultValue="non"/>
          <ivz-checkbox field="roleIds" label="用户角色" url="/core/role/list" labelField="name" valueField="id" span="24"/>
          <ivz-textarea field="remark" label="用户简介" span="24" />
        </IvzRow>
      </template>
      <template #title="{model}">
        {{model.id != null ? '修改用户' : '新增用户'}}
      </template>
    </IvzPrimaryDrawer>
    <IvzPrimaryTable :columns="columns" :bordered="true" size="small" />
    <!--  修改密码  -->
    <IvzBasicModal id="modPwd" title="修改密码" ref="pwdModalRef" :span="[6, 15]" :rules="pwdRules">
      <ivz-input-password label="密码" field="password" />
      <ivz-input-password label="确认密码" field="surePwd" />
      <template #footer>
        <a-button type="primary" @click="submit" :loading="loading">提交</a-button>
        <a-button @click="cancelModPwd">取消</a-button>
      </template>
    </IvzBasicModal>
  </ivz-menu-view>
</template>

<script>

import {ref} from "vue";
import {msgSuccess} from "@/utils/message";
import {IvzPrimaryTable, IvzPrimaryDrawer, IvzPrimarySearch} from "@/components/view";
import IvzBasicModal from "@/components/modal/IvzBasicModal";
export default {
  name: "User",
  components: {IvzBasicModal, IvzPrimaryTable, IvzPrimarySearch, IvzPrimaryDrawer},
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

    let pwdModalRef = ref(null);
    let validator = (a,b,c) => {
      let editModel = pwdModalRef.value.getEditModel();
      return new Promise((resolve, reject) => {
        if(b == null || b == '') {
          reject("请输入确认密码");
        } else if(editModel.password != editModel.surePwd) {
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
    return {columns, rules, status, sex, pwdRules, loading, pwdModalRef}
  },
  mounted() {
    this.pwdModalRef = this.$refs['pwdModalRef']
    // 修改密码功能点
    let pwdFunMeta = this.$view.getMetaContext().getTableMeta('Pwd');
    if(pwdFunMeta) {
      pwdFunMeta.callback = (row, meta) => {
        this.$view.getEditContext("modPwd")
            .asyncVisible().then(model => {
          model.id = row.id;
        })
      }
    }
  },
  methods: {
    submit() {
      let pwdMeta = this.$view.getMetaContext().getTableMeta('Pwd');
      this.$view.getEditContext("modPwd").submit(pwdMeta.url)
    },

    cancelModPwd() {
      this.$view.getEditContext('modPwd').setVisible(false)
    }
  }
}
</script>

<style scoped>

</style>
