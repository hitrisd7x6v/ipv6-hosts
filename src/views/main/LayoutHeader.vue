<template>
  <a-layout-header class="ivz-header-bar" style="background: #fff; padding: 0">
    <div class="ivz-header-row">
      <!--头部菜单-->
      <div class="ivz-header-col ivz-header-col-left">
        <ul style="list-style: none; padding: 0px; margin: 0px; float: left">
          <li v-for="view in views" :key="view.id"
              :class="view == activityView ? 'ivz-view-active':null"
              style="float: left" @click="viewHandler(view)" class="ivz-view-col">
            <ivz-icon :type="view.icon" :size="16"></ivz-icon>&nbsp;{{view.name}}
          </li>
          <li style="clear: both"></li>
        </ul>
      </div>
      <div class="ivz-header-col ivz-header-col-right">
        <ul style="list-style: none; padding: 0px; margin: 0px">
          <li class="ivz-opera-col">
            <a-dropdown placement="bottomCenter" class="ivz-opera-more">
              <div>
                <a-avatar :src="user.avatar" :size="32" :load-error="loadError"></a-avatar>
              </div>
              <template #overlay>
                <a-menu @click="quickOpera">
                  <a-menu-item key="user">
                    <ivz-icon type="iz-icon-profile" style="font-size: 16px"/>
                    <span>个人资料</span>
                  </a-menu-item>
                  <a-menu-item key="pwd">
                    <LockFilled style="font-size: 16px"/><span>修改密码</span>
                  </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item key="logout">
                    <LogoutOutlined style="font-size: 16px" /><span>退出登录</span>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </li>
          <li class="ivz-opera-col">
            <a href="https://gitee.com/iteaj/ivzone" target="_blank">
              <ivz-icon type="iz-icon-gitee" style="font-size: 22px"></ivz-icon>
            </a>
          </li>
          <li class="ivz-opera-col" @click="() => quickOpera({key: 'msg'})">
            <a-tooltip title="消息通知">
              <a-badge count="5">
                <ivz-icon type="iz-icon-notify" style="font-size: 22px"/>
              </a-badge>
            </a-tooltip>
          </li>
          <li class="ivz-opera-col" @click="() => quickOpera({key: 'wait'})">
            <a-tooltip title="代办事项">
              <a-badge count="5">
                <ivz-icon type="iz-icon-daiban" style="font-size: 22px"/>
              </a-badge>
            </a-tooltip>
          </li>
          <li style="clear: both"></li>
        </ul>
      </div>
      <div style="clear: both"></div>
    </div>
    <div class="ivz-task-bar">
      <a-tabs :active-key="activityMenu.url" @change="switchTask" :hide-add="true"
              @edit="closeTask" type="editable-card" size="small">

        <template v-for="menu in taskBarData" :key="menu.url">
          <a-tab-pane :closable="menu.closable != false">
            <template #tab>
<!--              <ReloadOutlined class="ivz-tba-reload"/>-->
              <span class="ivz-tba-dot"></span>
              <span class="ivz-tba-title">{{menu.name}}</span>
            </template>
          </a-tab-pane>
        </template>
      </a-tabs>
    </div>
  </a-layout-header>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import {ReloadOutlined, LockFilled, LogoutOutlined, NotificationFilled} from '@ant-design/icons-vue'
export default {
  name: "LayoutHeader",
  computed: {
    ...mapGetters({
      user: 'sys/user',
      views: 'sys/views',
      taskBarData: 'sys/taskBarData',
      selectedKeys: 'sys/selectedKeys',
      activityMenu: 'sys/activityMenu',
      activityView: 'sys/activityView',
    }),
  },
  components: {ReloadOutlined, LockFilled, LogoutOutlined, NotificationFilled},
  setup() {
    let workMenu = {}
    return {workMenu}
  },
  methods: {
    ...mapMutations({
      toggleUserVisible: 'sys/toggleUserVisible',
      switchActiveViewTo: 'sys/switchActiveViewTo',
      switchActiveMenuTo: 'sys/switchActiveMenuTo',
    }),
    switchTask (url) { // 切换任务菜单处理
      this.switchActiveMenuTo(url);
    },
    closeTask (url, action) { // 关闭任务处理
      let prevTemp = null; // 用来保存当前关闭的上一个任务
      this.taskBarData.forEach((item, index, ori) => {
        if(item['url'] === url) {
          prevTemp = ori[index-1]; // 获取要删除的前一个
          ori.splice(index, 1);
          if(!prevTemp) prevTemp = ori[index];
        }
      });

      if(prevTemp) {
        this.switchTask(prevTemp['url']);
      } else {
        this.selectedKeys[0] = '';
        this.$router.push('/');
      }
    },
    taskBarCloseMoreOpera (item) { // 任务栏菜单关闭处理
      let start = this.workMenu ? 1 : 0;
      if (item.key === 'all') {
        if(this.workMenu) {
          this.switchActiveMenuTo(this.workMenu);
          this.selectedKeys[0] = this.activityMenu['url']
        }

        this.taskBarData.splice(start, this.taskBarData.length)
      } else { // 关闭除当前激活的任务以外的所有任务
        let position = 1
        for(let index=0; index < this.taskBarData.length; main++) {
          let item = this.taskBarData[index];
          if (item === this.activityMenu) {
            position = index; break;
          }
        }
        this.taskBarData.splice(position + 1, this.taskBarData.length - position - 1)
        this.taskBarData.splice(start, Math.abs(position - start))
      }
    },
    viewHandler(view) {
      if(view.type == 'G' && this.collapsed) {
        this.collapsed = !this.collapsed;
      }

      this.switchActiveViewTo(view)
    },
    quickOpera({key}) {
      if(key != 'logout') {
        this.toggleUserVisible({visible: true, key});
      }
    },
    loadError() {
      this.user.avatar = '/img/logo.png';
    },
  }
}
</script>

<style>
.ivz-header-bar{
  z-index: 0;
  padding: 0px!important;
  height: 83px!important;
  background-color: #ffffff!important;
}

.ivz-header-row {
  color: #000000;
  position: relative;
  border-bottom: 1px dashed #e9e9e9;
}
.ivz-view-col {
  padding: 0px 12px;
  cursor: pointer;
}
.ivz-view-active {
  border-bottom: 2px solid dodgerblue;
}
.ivz-opera-col {
  height: 45px;
  padding: 0px 12px;
  line-height: 52px;
}
.ivz-opera-col:hover {
  cursor: pointer;
  background-color: #fafafa;
}
.ivz-header-col {
  position: absolute;
}
.ivz-header-row,.ivz-header-col,.ivz-view-col{
  height: 45px;
  line-height: 45px;
}
.ivz-header-col-right {
  right: 8px;
}
.ivz-header-col-right .ivz-opera-col {
  float: right;
}
/*任务栏*/
.ivz-task-bar {
  z-index: 0;
  padding: 0px;
  position: relative;
  box-shadow: 0px 2px 4px -2px #e0e0e0;
}
.ivz-task-bar .ant-tabs-tab-active {
  box-shadow: 0px 0px 6px 0px #cbcbcb;
}

.ivz-tba-dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  display: inline-block;
}
.ivz-tba-title {
  color: #000000;
  margin-left: 5px;
}
.ivz-tba-reload {
  display: none;
  color: #000000;
  font-size: 16px;
}
.ant-tabs-tab-active .ivz-tba-dot {
  background: dodgerblue;
}
.ant-tabs-tab-active .ivz-tba-title {
  color: #3e3e3e;
}
.ant-tabs-tab-active .ivz-tba-reload {
  display: inline-block;
}
.ivz-task-bar .ant-tabs {
  width: 100%;
}
.ivz-task-bar .ant-tabs-bar {
  /*border-radius: 16px;*/
  /*height: 32px!important;*/
  border: 0px!important;

}
.ivz-task-bar .ant-tabs-nav-container,iz-task-more-opera,.ivz-task-bar .ant-tabs-tab {
  height: 35px!important;
  line-height: 36px!important;
}
.ivz-task-bar .ant-tabs-nav-container .ant-tabs-nav-wrap {
  margin-top: 0px;
  padding-left: 32px;
}
.ivz-task-bar .ant-tabs-tab-prev,.ivz-task-bar .ant-tabs-tab-next {
  height: 100%;
  width: 22px!important;
  padding-bottom: 2px;
  opacity: 1!important;
  color: #17233d!important;
  pointer-events: auto!important;
}
:root .ant-tabs-tab-prev-icon-target, :root .ant-tabs-tab-next-icon-target {
  font-size: 14px;
}
.ivz-task-bar .ant-tabs-tab {
  color: rgba(64, 64, 64, 0.86);
  padding: 0px 10px!important;
  border: 0px solid!important;
  border-right: 2px solid #ffffff !important;
  border-radius: 0px!important;
  transform: skewX(-28deg);
  background-color: unset!important;
}
.ivz-task-bar .ant-tabs-tab>div{
  transform: skewX(28deg);
}
.ivz-task-bar .ant-tabs-nav .ant-tabs-tab .anticon {
  margin-right: 0px!important;
}
.ivz-task-bar .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab-active {
  padding-bottom: 0px;
  background: #ffffff!important;
}
.ivz-task-bar .ant-tabs-bar.ant-tabs-top-bar.ant-tabs-small-bar.ant-tabs-card-bar {
  margin-left: 0px;
  margin-bottom: 0px;
}
</style>
