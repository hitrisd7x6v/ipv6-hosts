<template>
  <a-form ref="formRef" :model="user" :rules="rules" class="ivz-user-detail"
          :label-col="{span: 6}" :wrapper-col="{span: 18}">
    <a-row>
      <a-col :span="13">
        <a-form-item label="用户账号">
          {{user.account}}
        </a-form-item>
        <a-form-item label="用户昵称" name="name">
          <a-input v-model:value="user.name" />
        </a-form-item>
        <a-form-item label="用户邮箱" name="email">
          <a-input v-model:value="user.email" />
        </a-form-item>
        <a-form-item label="手机号码" name="phone">
          <a-input v-model:value="user.phone" />
        </a-form-item>
<!--        <a-form-item label="所属部门">-->
<!--          {{user.deptName}}-->
<!--        </a-form-item>-->
<!--        <a-form-item label="所属角色">-->
<!--          {{user.roleName}}-->
<!--        </a-form-item>-->
        <a-form-item label="个人简介" name="remark">
          <a-textarea v-model:value="user.remark" />
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
      <a-button @click="refresh" :loading="resetLoading" style="margin-right: 5px">重置</a-button>
      <a-button type="primary" :loading="loading" @click="submit">提交</a-button>
    </a-form-item>
  </a-form>
</template>

<!--用户资料-->
<script>
import {ref} from "vue";
import {mapGetters, mapMutations, useStore} from "vuex";
import {avatarUploadUri, editUser} from '@/api'
import {UserOutlined} from "@ant-design/icons-vue"
import {msgSuccess} from "@/utils/message";
import CoreConsts from "@/components/CoreConsts";

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

    let fileList = ref([]);
    let loading = ref(false);
    let resetLoading = ref(false);
    return {rules, loading, fileList, avatarUploadUri, resetLoading}
  },
  methods: {
    ...mapMutations({
      initUser: 'sys/toggleUserVisible',
      toggleUserVisible: 'sys/toggleUserVisible'
    }),
    submit() {
      this.$refs['formRef'].validate().then(resp => {
        this.loading = true;
        editUser(this.user).then(({code, message}) => {
          if(code == CoreConsts.SuccessCode) {
            this.$msg.success(message || CoreConsts.SubmitSuccessMsg);
            // this.toggleUserVisible({visible: false})
          } else {
            this.$msg.error(message);
          }
        }).finally(() => this.loading = false)
      });
    },
    refresh() {
      this.resetLoading = true;
      this.$store.dispatch('sys/initUser').finally(() => this.resetLoading = false)
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
