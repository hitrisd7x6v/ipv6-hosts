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
<!--                <a-avatar :src="avatarUrl" :size="32" :load-error="loadError"></a-avatar>-->
                <span style="font-size: 14px;"> 欢迎, {{user.name}}</span>
              </div>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="info">
                    <ivz-icon type="iz-icon-user-info"></ivz-icon>
                    <span>个人信息</span>
                  </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item key="logout">
                    <ivz-icon type="iz-icon-logout"></ivz-icon>
                    <span>退出登录</span>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </li>
          <li class="ivz-opera-col">
            <a-tooltip title="系统通知">
              <ivz-icon type="iz-icon-notify" style="font-size: 18px" />
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
      <div class="ivz-task-opera right">
        <a-dropdown placement="bottomLeft">
          <span>
            <ivz-icon type="iz-icon-more" size="18px"></ivz-icon>
          </span>
          <a-menu slot="overlay" @click="taskBarCloseMoreOpera">
            <a-menu-item key="other">
              <ivz-icon type="iz-icon-close-other"></ivz-icon>
              <span>关闭其他</span>
            </a-menu-item>
            <a-menu-item key="all">
              <ivz-icon type="iz-icon-close-all"></ivz-icon>
              <span>关闭所有</span>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </div>
  </a-layout-header>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import {ReloadOutlined} from '@ant-design/icons-vue'
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
  components: {ReloadOutlined},
  setup() {
    let avatarUrl = '/src/assets/logo.png';
    let workMenu = {}
    return {workMenu, avatarUrl}
  },
  methods: {
    ...mapMutations({
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
    loadError() {},
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
  padding: 0px 8px;
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
  /*background: rgba(243, 243, 243, 0.68);*/
  box-shadow: 0px 3px 4px -1px #e0e0e0;
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
.ivz-task-opera {
  width: 20px;
  position: absolute;
  top: 0px;
  left: 24px;
  cursor: pointer;
  height: 35px;
  line-height: 35px;
  text-align: center;
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
.ant-tabs-nav-container,iz-task-more-opera,.ivz-task-bar .ant-tabs-tab {
  height: 35px!important;
  line-height: 36px!important;
}
.ivz-task-bar .ant-tabs-nav-container .ant-tabs-nav-wrap {
  margin-top: 0px;
  padding-left: 52px;
}
.ant-tabs-tab-prev,.ant-tabs-tab-next {
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
