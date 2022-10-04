<template>
  <ivz-menu-view name="用户">
    <ivz-view-search>
      <ivz-input field="name" label="用户昵称" />
      <ivz-input field="account" label="用户帐号" />
      <ivz-input field="phone" label="用户手机" />
      <ivz-radio field="status" label="用户状态" :options="status"/>
    </ivz-view-search>
    <ivz-view-modal :span="[6,15]" :rules="rules">
      <template #default="{model}">
        <ivz-input field="name" label="用户昵称" />
        <ivz-input field="account" label="用户帐号" :disabled="model.id"/>
        <ivz-radio field="status" label="用户状态"
                   defaultValue="enabled" :options="status"/>
        <ivz-radio field="sex" label="用户性别" :options="sex" defaultValue="non"/>
        <ivz-input field="phone" label="用户手机" />
        <ivz-input field="email" label="用户邮箱" />
      </template>
    </ivz-view-modal>
    <ivz-view-table :columns="columns" :bordered="true" size="small" />
  </ivz-menu-view>
</template>

<script>
import {reactive} from "vue";
import {FunMetaMaps} from "@/utils/SysUtils";

export default {
  name: "User",
  setup() {
    let sex = [{label: '男', value: 'man'}, {label: '女', value: 'woman'}, {label: '无', value: 'non'}]
    let columns = [
      {type: 'selection', fixed: true},
      {title: '用户昵称', field: 'name'},
      {title: '用户账号', field: 'account'},
      {title: '性别', field: 'sex', options: sex},
      {title: '手机', field: 'phone'},
      {title: '邮箱', field: 'email'},
      {title: '状态', field: 'status'},
      {title: '创建时间', field: 'createTime'},
      {title: '操作', field: 'action', type: 'action'},
    ]

    let status = [
      {label: '启用', value: 'enabled'}, {label: '禁用', value: 'disabled'}
    ]

    let rules = {
      name: {required: true, message: '用户昵称必填'},
      account: {required: true, message: '用户帐号必填'},
    }
    return {columns, rules, status, sex}
  },
  mounted() {
    let viewMeta = this.getSearchFunMeta(FunMetaMaps.View);
  },
  methods: {
    edit() {
      this.model.user.name = 8;
    },
    submit(e) {
      let formRef = this.$refs['basicForm'];
      formRef.resetFields();
    }
  }
}
</script>

<style scoped>

</style>
