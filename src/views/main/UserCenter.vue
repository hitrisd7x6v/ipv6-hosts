<template>
  <a-drawer :visible="visible" :width="'100%'" @close="closeHandle"
      placement="left" closable :get-container="false" title="个人中心"
      :after-visible-change="afterVisibleChange" wrapClassName="ivz-user-info"
      :wrap-style="{ position: 'absolute' }" :bodyStyle="{height: '100%'}">
    <div class="ivz-ui-content">
<!--      <div class="ivz-uic-profile">-->
<!--        <UserProfile />-->
<!--      </div>-->
      <div class="ivz-uic-info">
        <a-tabs :activeKey="activeKey" @change="tabChange">
          <a-tab-pane key="user">
            <template #tab>
              <span><ivz-icon type="iz-icon-profile" />个人资料</span>
            </template>
            <UserDetail />
          </a-tab-pane>
          <a-tab-pane key="pwd">
            <template #tab>
              <span><ivz-icon type="iz-icon-password" />修改密码</span>
            </template>
            <UserEditPwd />
          </a-tab-pane>
          <a-tab-pane key="wait">
            <template #tab>
              <span><ivz-icon type="iz-icon-daiban" />代办事项</span>
            </template>
            <UserOperaHistory />
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </a-drawer>
</template>
<!--用户中心-->
<script>
import {mapGetters, mapMutations} from "vuex";
import UserDetail from "@msn/main/UserDetail.vue";
import UserProfile from "@msn/main/UserProfile.vue";
import UserEditPwd from "@msn/main/UserEditPwd.vue";
import UserNotifyList from "@msn/main/UserNotifyList.vue";
import UserOperaHistory from "@msn/main/UserOperaHistory.vue";

export default {
  name: "UserCenter",
  components: {
    UserDetail,
    UserProfile,
    UserEditPwd,
    UserNotifyList,
    UserOperaHistory
  },
  computed: {
    ...mapGetters({
      activeKey: 'sys/userKey',
      visible: 'sys/userVisible',
    })
  },
  methods: {
    ...mapMutations({
      toggleUserVisible: 'sys/toggleUserVisible'
    }),
    tabChange(key) {
      this.toggleUserVisible({key});
    },
    closeHandle() {
      this.toggleUserVisible({visible: false});
    },
    afterVisibleChange() {

    }
  }
}
</script>

<style>
.ivz-user-info .ant-upload.ant-upload-select-picture-card {
  width: auto;
  border: 0px;
  background-color: #ffffff;
}
.ivz-ui-content {
  height: 100%;
  display: flex;
  flex-direction: row;
}
.ivz-uic-profile {
  width: 288px;
  min-width: 288px;
  border-radius: 5px;
  box-shadow: 0px 0px 5px 1px #fafafa;
}

.ivz-uic-avatar .ant-upload-list-picture-card-container {
  width: 132px;
  height: 132px;
}

.ivz-uic-info {
  flex-grow: 1;
  margin: 0px 6px;
}
.ivz-uic-info .anticon {
  font-size: 16px;
}
.ivz-uic-info .ant-tabs-tab {
  padding: 6px 16px!important;
}

.ivz-uic-item .paragraph {
  padding-left: 24px;
}

</style>
