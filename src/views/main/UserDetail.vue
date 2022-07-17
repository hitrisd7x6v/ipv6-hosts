<template>
  <a-form ref="formRef" :model="user" :rules="rules"
          :label-col="{span: 6}" :wrapper-col="{span: 14}" @finish="submit">
    <a-form-item label="用户昵称" name="nickName">
      <a-input v-model:value="user.nickName" />
    </a-form-item>
    <a-form-item label="用户邮箱" name="email">
      <a-input v-model:value="user.email" />
    </a-form-item>
    <a-form-item label="手机号码" name="phone">
      <a-input v-model:value="user.phone" />
    </a-form-item>
    <a-form-item label="个人简介" name="profile">
      <a-textarea v-model:value="user.profile" />
    </a-form-item>
    <a-form-item label=" " :colon="false">
      <a-button type="primary" :loading="loading" html-type="submit">提交</a-button>
    </a-form-item>
  </a-form>
</template>

<!--用户资料-->
<script>
import {mapGetters} from "vuex";
import {ref} from "vue";

export default {
  name: "UserDetail",
  computed: {
    ...mapGetters({
      user: 'sys/user'
    })
  },
  setup() {
    let rules = ref({
      phone: {required: true, message: '手机号必填'},
      email: {required: true, message: '邮箱必填'},
      nickName: {required: true, message: '用户昵称必填'},
    });
    let loading = ref(false);

    return {rules, loading}
  },
  methods: {
    submit() {

    }
  }
}
</script>

<style scoped>

</style>
