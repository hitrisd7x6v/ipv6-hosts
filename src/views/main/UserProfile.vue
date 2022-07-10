<template>
  <div class="ivz-uic-avatar">
    <a-upload action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              :withCredentials="true" list-type="picture-card" v-model:file-list="fileList"
              @preview="handlePreview" :show-upload-list="false">
      <a-avatar :size="128" :src="user.avatar">
        <template #icon>
          <UserOutlined />
        </template>
      </a-avatar>
    </a-upload>
  </div>
  <div class="ivz-uic-detail">
    <h2 style="text-align: center">{{user.nickName}}</h2>
    <a-form>
      <ul class="ivz-uid-ul">
        <li class="ivz-uid-li">
          <user-profile-item v-model="user.account" :blur="submit" :editable="true">
            <template #label>
              <UserOutlined style="vertical-align: text-top"/> 用户账号
            </template>
          </user-profile-item>
        </li>
        <li class="ivz-uid-li">
          <user-profile-item v-model="user.phone" :blur="submit" :editable="true">
            <template #label>
              <PhoneFilled style="vertical-align: text-top"/> 手机号码
            </template>
          </user-profile-item>
        </li>
        <li class="ivz-uid-li">
          <user-profile-item v-model="user.deptName">
            <template #label>
              <DeploymentUnitOutlined style="vertical-align: text-top"/> 所属部门
            </template>
          </user-profile-item>
        </li>
      </ul>
    </a-form>
  </div>
</template>

<script>
import {
  DeploymentUnitOutlined,
  EditOutlined,
  EllipsisOutlined,
  FieldTimeOutlined,
  MailFilled,
  PhoneFilled,
  SettingOutlined,
  UserOutlined
} from '@ant-design/icons-vue'
import {mapGetters} from "vuex";
import {ref, defineComponent, h} from "vue";
import UserProfileItem from "@msn/main/UserProfileItem.vue";
import {editUser} from "@/api";

export default {
  name: "UserProfile",
  components: {
    UserProfileItem, SettingOutlined, EditOutlined, EllipsisOutlined, UserOutlined
  , PhoneFilled, MailFilled, DeploymentUnitOutlined, FieldTimeOutlined},
  computed: {
    ...mapGetters({
      user: 'sys/user'
    })
  },
  setup() {
    let avatar = ref(false);
    let fileList = ref([]);
    return {avatar, fileList}
  },
  methods: {
    submit(value) {
      return new Promise(((resolve, reject) => {
        editUser(this.user).then(resolve).catch(reject)
      }))
    },
    handlePreview() {

    },
  }
}
</script>

<style scoped>
.ivz-uic-avatar {
  text-align: center;
}
.ivz-uic-detail {
  padding: 0px 5px;
  text-align: center;
}
.ivz-uid-ul {
  margin: 0px;
  padding: 0px;
  list-style: none;
}
.ivz-uid-li {
  padding: 3px;
  height: 42px;
  margin: 3px 0px;
  line-height: 35px;
  border-bottom: 1px solid #e9e9e9;
}
.ivz-uid-item.editable {
  flex-grow: 1;
  text-align: right;
}
</style>
