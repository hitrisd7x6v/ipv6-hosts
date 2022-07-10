<template>
  <a-form ref="formRef" :model="pwdModel" :rules="rules"
          :label-col="{span: 6}" :wrapper-col="{span: 14}" @finish="submit">
    <a-form-item ref="name" label="旧密码" name="oldPwd">
      <a-input-password v-model:value="pwdModel.oldPwd" />
    </a-form-item>
    <a-form-item ref="name" label="新密码" name="newPwd">
      <a-input-password v-model:value="pwdModel.newPwd" />
    </a-form-item>
    <a-form-item ref="name" label="确认密码" name="surePwd">
      <a-input-password v-model:value="pwdModel.surePwd" />
    </a-form-item>
    <a-form-item label=" " :colon="false">
      <a-button type="primary" :loading="loading" html-type="submit">提交</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import {editPwd} from "@/api";
import {reactive, ref} from "vue";

export default {
  name: "UserEditPwd",
  setup() {
    let loading = ref(false);
    let pwdModel = reactive({oldPwd: '', newPwd: '', surePwd: ''});
    let rules = reactive({
      oldPwd: {required: true, message: '请输入旧密码'},
      newPwd: {required: true, message: '请输入新密码'},
      surePwd: [
        {required: true, message: '请输入确认密码'},
        {validator: (rule, value) => {
            return pwdModel.newPwd == value ? Promise.resolve()
                : Promise.reject('两次密码不一致')
          }
        }
      ]
    });
    return {pwdModel, loading, rules}
  },
  methods: {
    submit() {
      this.loading = true;
      editPwd(this.pwdModel).finally(() => this.loading = false)
    },
  }
}
</script>

<style scoped>

</style>
