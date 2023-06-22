<template>
  <ARow :gutter="18" class="u-user-profile">
    <ACol span="6" style="background: #ffffff;">
      <ACard :bordered="false">
        <div style="text-align: center; padding-top: 8px">
          <a-avatar :size="110" :src="user.avatar" @click="avatarClick">
            <template #icon><UserOutlined /></template>
          </a-avatar>
          <h2 class="u-user-name">{{user.name}}</h2>
          <div class="u-user-desc">{{user.remark}}</div>
        </div>
        <div class="u-user-list">
          <div class="u-list-item">

          </div>
        </div>
      </ACard>
    </ACol>
    <ACol span="18">
      <div style="background: #ffffff; padding: 16px">
        <ATabs>
          <a-tab-pane key="1" tab="基本信息">
            <UForm v-model="user" :span="[2, 8]">
              <UInput field="name" label="昵称" size="large" />
              <UInput field="sex" label="性别" size="large" />
              <UInput field="email" label="邮箱" size="large" />
              <UTextarea field="remark" label="个人简介" />
              <UInput field="address" label="地址" />
            </UForm>
          </a-tab-pane>
        </ATabs>
      </div>
    </ACol>
    <a-modal v-model:visible="visible" :footer="null" title="裁剪图片" :width="680">
      <div style="width: 500px; height: 280px">
        <vueCropper  ref="cropper" img="/img/logo.png" :outputSize="options.size" :outputType="options.outputType">

        </vueCropper>
        <div class="test-button">

        </div>
      </div>
    </a-modal>
  </ARow>
</template>
<!--https://github.com/xyxiao001/vue-cropper-->
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
import {reactive, ref} from "vue";
import 'vue-cropper/dist/index.css'
import { VueCropper }  from "vue-cropper";

export default {
    name: "UserProfile",
    components: {
        SettingOutlined, EditOutlined, EllipsisOutlined, UserOutlined, VueCropper
        , PhoneFilled, MailFilled, DeploymentUnitOutlined, FieldTimeOutlined
    },
    computed: {
        ...mapGetters({
            user: 'sys/user'
        })
    },
    setup () {
        let avatar = ref(false);
        let fileList = ref([]);
        let visible = ref(false);
        let options = reactive({
          size: 0,
          outputType: 'jpeg'
        });
        return { avatar, fileList, visible, options}
    },
    methods: {
      avatarClick() {
        this.visible = true;
      }
    }
}
</script>

<style scoped>
.u-user-profile {
  margin-left: unset!important;
  margin-right: unset!important;
}
.u-user-name {
  font-size: 24px;
  margin-top: 20px;
  margin-bottom: 0.1em;
}
.u-user-list {
  margin-top: 30px;
}
</style>
