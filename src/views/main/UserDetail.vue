<template>
  <a-form ref="formRef" :model="user" :rules="rules"
          :label-col="{span: 6}" :wrapper-col="{span: 14}" @finish="submit">
    <a-form-item ref="name" label="旧密码" name="oldPwd">
      <a-input-password v-model:value="user.oldPwd" />
    </a-form-item>
    <a-form-item ref="name" label="新密码" name="newPwd">
      <a-input-password v-model:value="user.newPwd" />
    </a-form-item>
    <a-form-item ref="name" label="确认密码" name="surePwd">
      <a-input-password v-model:value="user.surePwd" />
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
    let rules = ref([]);
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
