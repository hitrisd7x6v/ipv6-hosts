<template>
  <a-form ref="formRef" :model="user" :rules="rules" class="ivz-user-detail"
          :label-col="{span: 6}" :wrapper-col="{span: 18}" @finish="submit">
    <a-row>
      <a-col :span="13">
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
      </a-col>
      <a-col :span="11" style="text-align: center; padding-top: 12px">
        <a-upload :action="avatarUploadUri" @preview="handlePreview" :show-upload-list="false"
                  :withCredentials="true" list-type="picture-card" v-model:file-list="fileList">
          <a-avatar :size="156" :src="user.avatar">
            <template #icon>
              <UserOutlined />
            </template>
          </a-avatar>
        </a-upload>
        <h2>用户头像</h2>
      </a-col>
    </a-row>
    <a-form-item label=" " :colon="false">
      <a-button type="primary" :loading="loading" html-type="submit">提交</a-button>
    </a-form-item>
  </a-form>
</template>

<!--用户资料-->
<script>
import {ref} from "vue";
import {mapGetters} from "vuex";
import {avatarUploadUri} from '@/api'
import {UserOutlined} from "@ant-design/icons-vue"

export default {
  name: "UserDetail",
  components: {UserOutlined},
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

    let fileList = ref([]);
    return {rules, loading, fileList, avatarUploadUri}
  },
  methods: {
    submit() {

    },
    handlePreview() {

    },
  }
}
</script>

<style>
.ivz-user-detail .ant-upload-picture-card-wrapper{
  width: unset;
}
</style>
