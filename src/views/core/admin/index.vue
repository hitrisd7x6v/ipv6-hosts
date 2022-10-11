<template>
  <ivz-menu-view name="用户">
    <ivz-view-search>
      <ivz-input field="name" label="用户昵称" />
      <ivz-input field="account" label="用户帐号" />
      <ivz-input field="phone" label="用户手机" />
      <ivz-radio field="status" label="用户状态" :options="status"/>
    </ivz-view-search>
    <ivz-view-drawer width="860" layout="vertical" :rules="rules" placement="left">
      <template #default="{model}">
        <a-row :gutter="16">
          <a-col span="8">
            <ivz-input field="name" label="用户昵称" />
          </a-col>
          <a-col span="8">
            <ivz-input field="account" label="用户帐号" :disabled="model.id != null"/>
          </a-col>
          <a-col span="8">
            <ivz-tree-select field="orgId" label="所属部门" treeNodeFilterProp="label"
                 url="/core/org/parent" labelField="name" valueField="id"/>
          </a-col>
          <a-col span="8">
            <ivz-input field="email" label="用户邮箱" />
          </a-col>
          <a-col span="8">
            <ivz-radio field="status" label="用户状态"
                       defaultValue="enabled" :options="status"/>
          </a-col>
          <a-col span="8">
            <ivz-radio field="sex" label="用户性别" :options="sex" defaultValue="non"/>
          </a-col>
          <a-col span="24">
            <ivz-checkbox field="roleIds" label="用户角色"
              url="/core/role/list" labelField="name" valueField="id"/>
          </a-col>
          <a-col span="24">
            <ivz-textarea field="remark" label="用户简介" />
          </a-col>
        </a-row>
      </template>
    </ivz-view-drawer>
    <ivz-view-table :columns="columns" :bordered="true" size="small" />
    <!--  修改密码  -->
    <ivz-edit-modal ref="pwdModalRef" title="修改密码" :span="[6, 15]" :rules="pwdRules">
      <ivz-input-password label="密码" field="password" />
      <ivz-input-password label="确认密码" field="surePwd" />
      <template #fun>
        <a-button type="primary" @click="submit" :loading="loading">提交</a-button>
        <a-button @click="cancel">取消</a-button>
      </template>
    </ivz-edit-modal>
  </ivz-menu-view>
</template>

<script>

import IvzEditModal from "@/components/edit/IvzEditModal";
import {ref} from "vue";
import {msgSuccess} from "@/utils/message";
export default {
  name: "User",
  components: {IvzEditModal},
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
    let pwdFunMeta = this.getTableFunMeta('Pwd');
    if(pwdFunMeta) {
      pwdFunMeta.callback = (row, meta) => {

        // 打开编辑框
        this.pwdModalRef.openByAsync().then(editModel => {
          editModel.id = row.id;
        });
      }
    }
  },
  methods: {
    submit() {
      let {validate} = this.pwdModalRef.getEditContext();

      validate().then(() => {
        let pwdFunMeta = this.getTableFunMeta('Pwd');
        let editModel = this.pwdModalRef.getEditModel();

        this.loading = true;
        this.$http.post(pwdFunMeta.url, editModel)
            .then(({message, data}) => {
              msgSuccess(message)
              this.pwdModalRef.switchActive(false);
        }).finally(() => this.loading = false)
      })
    },

    cancel() {
      this.pwdModalRef.switchActive(false);
    }
  }
}
</script>

<style scoped>

</style>
