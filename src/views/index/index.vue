<template>
  <a-layout style="width: 100%; height: 100%">
    <!--侧边栏-->
    <a-layout-sider class="ivz-sider-menu" width="208"
          v-model:collapsed="collapsed" collapsible :collapsedWidth="72">
      <div class="logo">
        <a-avatar :size="48" src="/img/logo.png"></a-avatar>
        <span style="vertical-align: sub; margin-left: 8px; font-size: 17px">由创源科技</span>
      </div>
      <!--侧边菜单-->
      <div style="flex: 1 1 0%; overflow: hidden auto;">
        <a-menu @select="selectMenu" mode="inline"
                v-model:openKeys="openKeys" :theme="theme"
                v-model:selectedKeys="selectedKeys" @openChange="openChange">
          <template v-for="menu in menus">
            <a-menu-item v-if="!menu.children" :key="menu.url">
              <ivz-icon :type="menu.icon"></ivz-icon>
              <span class="ivz-level-o">{{menu.name}}</span>
            </a-menu-item>
            <template v-else>
              <!--递归的子菜单-->
              <ivz-sub-menu :menu-info="menu" :key="menu.url"></ivz-sub-menu>
            </template>
          </template>
        </a-menu>
      </div>
    </a-layout-sider>
    <a-layout>
      <!--右侧头-->
      <a-layout-header class="layout-header-bar" style="background: #fff; padding: 0">
        <div class="ivz-header-row">
          <!--头部菜单-->
          <div class="ivz-header-col ivz-header-col-left">
            <ul style="list-style: none; padding: 0px; margin: 0px; float: left">
              <li v-for="view in views" :key="view.id"
                  :class="view == activityView ? 'iz-view-activity':null"
                  style="float: left" @click="viewHandler(view)" class="iz-view-col">
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
                    <a-avatar :src="avatarUrl" :size="32" :load-error="loadError"></a-avatar>
                    <span style="font-size: 14px;"> 欢迎, {{user.name}}</span>
                  </div>
                  <template #overlay>
                    <a-menu @click="moreOpera">
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
              <li class="ivz-opera-col" @click="handleNotify">
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
                <ivz-icon :type="menu.icon" class="icon"></ivz-icon>
                <span style="margin-left: 5px">{{menu.name}}</span>
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
      <a-layout-content class="iz-main-container" id="container">
        <router-view v-slot="{ Component }">
          <transition name="fade">
            <component :is="Component" />
          </transition>
        </router-view>
        <ivz-user-info ref="userInfo"/>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import {getMenus} from '@/api/index'
import IvzUserInfo from '@msn/index/UserInfo.vue'
import IvzSubMenu from '@/views/index/SubMenu.vue'
export default {
  name: "index",
  components:{IvzSubMenu, IvzUserInfo},
  setup() {
    return {
      prevOpenKeys: [],
      avatarUrl: '',
      urlMenuMap: {},
    }
  },
  data() {
    return {
      height: '100%',
      user: {name: 'admin'},
      config: null,
      sysName: '',
      openKeys: [],
      viewMenu: [],
      views: [],
      menus: [],
      collapsed: false,
      theme: 'dark', // 主题 dark or light
      notifyVisible: false,
      fixedSider: false, // 固定侧边栏
      activityMenu: {}, // 激活的菜单
      activityView: null,
      selectedKeys: [], // 当前选中的菜单
      taskBarData: [], // 任务栏数据
      workMenu: null,
      expandMode: 'single', // 菜单展开模式 (single || multi)
    }
  },
  created() {
    getMenus().then(resp=>{
      this.views=resp['data'];
      this.resolverMenuMap(this.views);
      this.activityView = this.views[0];
      this.menus = this.activityView['children'] || []
    })
  },
  mounted() { },
  methods: {
    selectMenu(menu) {
      let menuByUrl = this.getMenuByUrl(menu.key);
      let containUrl = this.taskBarData.filter(item => item.url == menuByUrl.url).length > 0;
      if(!containUrl) {
        this.taskBarData.push(menuByUrl);
      }
      this.activityMenu = menuByUrl;
      this.selectedKeys = menu.selectedKeys;
      this.$router.push(menu.key);
    },
    openChange(openKeys) {
      if (this.expandMode === 'single') { // 单选
        let lastKey = openKeys.find(key =>{
          return this.prevOpenKeys.indexOf(key) === -1;
        }); // 最后打开的菜单
        if (!lastKey) { // 说明还在同一个父菜单内
          this.openKeys = this.prevOpenKeys = openKeys
        } else {
          this.openKeys = this.prevOpenKeys = [lastKey]
        }
      } else { // 多选
        this.openKeys = this.prevOpenKeys = openKeys;
      }
    },
    loadError() {

    },
    switchTask (url) { // 切换任务菜单处理
      if(this.isWorkMenu(url)) {
        this.activityMenu = this.workMenu;
        this.selectedKeys[0] = '';
      } else {
        let menuByUrl = this.getMenuByUrl(url);
        this.activityMenu = menuByUrl;
        this.$router.push(url);
      }
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
      }
    },
    taskBarCloseMoreOpera (item) { // 任务栏菜单关闭处理
      let start = this.workMenu ? 1 : 0;
      if (item.key === 'all') {
        if(this.workMenu) {
          this.activityMenu = this.workMenu;
          this.selectedKeys[0] = this.activityMenu['url']
        }

        this.taskBarData.splice(start, this.taskBarData.length)
      } else { // 关闭除当前激活的任务以外的所有任务
        let position = 1
        for(let index=0; index < this.taskBarData.length; index++) {
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

      this.activityView = view;
      this.menus = view['children'] || [];
    },
    handleNotify() {

    },
    moreOpera(key) {

    },
    getMenuByUrl(url) {
      return this.urlMenuMap[url];
    },
    isWorkMenu(url) {
      return this.workMenu && this.workMenu.url == url;
    },
    resolverMenuMap (menus) {
      for(let i=0; i<menus.length; i++) {
        let menu = menus[i];
        if (menu['type'] === 'V') {

          if(menu.status == 'hide') {
            menus.splice(i, 1); i--;
          }

          this.urlMenuMap[menu.url] = menu;
        } else if (menu['children']) {
          this.resolverMenuMap(menu['children'])
        }
      }
    },
  }
}
</script>

<style>
.trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

.trigger:hover {
  color: #1890ff;
}

.logo {
  height: 48px;
  margin: 12px;
  color: #ffffff;
  overflow: hidden;
  text-align: center;
  white-space: nowrap;
  text-overflow:ellipsis;
  vertical-align: middle;
}
.ivz-index-layout {
  overflow: hidden;
  position: relative;
}
.layout-header-bar{
  z-index: 0;
  padding: 0px!important;
  height: 80px!important;
  background-color: #ffffff!important;
}
.iz-header-col {
  /*height: 48px!important;*/
  /*line-height: 48px!important;*/
  border-top-right-radius: 12px;
  border-top-left-radius: 12px;
  /*box-shadow: inset 0px -2px 6px -3px #d8d3d3;*/
}

.ivz-header-row {
  height: 44px;
  line-height: 44px;
  color: #000000;
  position: relative;
  border-bottom: 1px dashed #e9e9e9;
}
.ivz-header-col {
  position: absolute;
}
.ivz-header-col-right {
  right: 8px;
}
.ivz-header-col-right .ivz-opera-col {
  float: right;
}
.ivz-divider {
  width:100%;
  height: 2px;
  /*margin: 0px auto;*/
  background:-webkit-linear-gradient(to left, #ffffff, #000000, rgba(255, 5, 5, 0.83),#000000, #ffffff);
  background:linear-gradient(to left, #ffffff, #000000, rgba(255, 5, 5, 0.83),#000000, #ffffff);
}
.ivz-global-search {
  min-width: 236px;
  max-width: 280px;
  margin-right: 18px;
}
.ivz-opera-col.ivz-global-search:hover{
  background: #ffffff!important;
}
.iz-view-col,.ivz-opera-col {
  cursor: pointer;
  padding: 0px 10px;
}
.iz-view-col:hover,.ivz-opera-col:hover,.iz-view-activity {
  background: #dfdfdf14;
}
.iz-right-dropdown {
  top: 52px!important;
  margin-right: 8px;
}
.ivz-opera-more {
  margin-right: 12px;
}
.ivz-opera-more .ant-avatar {
  vertical-align: -9px;
}
.iz-menu-item-title {
  margin-left: 8px;
}
/*通知抽屉*/
#slider-drawer .ant-drawer {
  top: 46px;
}
#slider-drawer .ant-drawer-content {
  background-color: #fefefe;
}
#slider-drawer .ant-drawer-mask {
  background-color: rgba(0, 0, 0, 0.08);
}
/*任务栏样式*/
.iz-main-container {
  width: 100%;
  height: 100%;
  display: flex;
  display: -ms-flex;
  overflow: hidden;
  flex-direction: column;
  display: -webkit-flex; /* Safari */
  justify-content: flex-start;
}
/*任务栏*/
.ivz-task-bar {
  z-index: 0;
  height: 32px;
  padding: 0px;
  position: relative;
  /*background: rgba(243, 243, 243, 0.68);*/
  box-shadow: 0px 2px 4px -1px #e0e0e0;
}
.ivz-task-bar .ant-tabs-tab-active {
  /*border-top: 0.1em solid #343434!important;*/
  box-shadow: 0px 0px 6px 0px #cbcbcb;
}
.ivz-task-bar .ant-tabs-tab-active>div {
  /*height: 33px;*/
  /*line-height: 33px;*/
}
.ivz-task-bar .ant-tabs-tab-active>div>.icon {
  color: #2b7f2b;
}
.ivz-task-opera {
  width: 20px;
  position: absolute;
  top: 0px;
  left: 24px;
  cursor: pointer;
  height: 32px;
  line-height: 35px;
  text-align: center;
  display: inline-block;
}
.ant-tabs {
  width: 100%;
}
.ant-tabs-bar {
  /*border-radius: 16px;*/
  /*height: 32px!important;*/
  border: 0px!important;

}
.ant-tabs-nav-container,iz-task-more-opera {
  line-height: 32px;
  height: 32px!important;
}
.ant-tabs-nav-container .ant-tabs-nav-wrap {
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
.ant-tabs-tab {
  color: rgba(64, 64, 64, 0.86);
  height: 32px!important;
  padding: 0px 10px!important;
  border: 0px solid!important;
  border-right: 2px solid #ffffff !important;
  border-radius: 0px!important;
  transform: skewX(-28deg);
  background-color: unset!important;
  line-height: 32px!important;
}
.ant-tabs-tab>div{
  transform: skewX(28deg);
}
.ant-tabs-nav .ant-tabs-tab .anticon {
  margin-right: 0px!important;
}
.ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab-active {
  padding-bottom: 0px;
  background: #ffffff!important;
}
.ant-tabs-bar.ant-tabs-top-bar.ant-tabs-small-bar.ant-tabs-card-bar {
  margin-left: 0px;
  margin-bottom: 0px;
}
.ivz-content-iframe {
  z-index: 0;
  width: 100%;
  flex-grow: 1;
  height: 100%;
  /*border-radius: 8px;*/
  /*border: 2px solid #ffffff;*/
  border-bottom: 0px solid #ffffff;
  background-color: rgba(243, 243, 243, 0.93);
}

.ivz-theme-dark .ivz-avatar{
  background-color: #001529;
}
.ivz-theme-dark .ivz-avatar .ivz-avatar-name{
  color: #ffffff;
}
.ivz-theme-dark .ivz-avatar .ant-avatar {
  background-color: #ffffff;
}

/*侧边栏*/
.ant-layout-sider {
  background: #001529;
}
.ant-layout-sider-children {
  height: 100%;
  display: flex;
  flex-direction: column;
}
/*侧边菜单栏滚动条样式*/
.ivz-sider-menu {
  overflow: hidden;
}
.ivz-sider-menu.ant-layout-sider-collapsed .ant-menu-inline-collapsed {
  width: 72px;
}
.ivz-sider-menu .ant-layout-sider-children ::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.ivz-sider-menu .ant-layout-sider-children ::-webkit-scrollbar-thumb {
  background: hsla(0,0%,100%,.2);
  border-radius: 3px;
  -webkit-box-shadow: inset 0 0 5px hsl(0deg 0% 100% / 5%);
}
.ivz-sider-menu .ant-layout-sider-children ::-webkit-scrollbar-track {
  background: hsla(0,0%,100%,.15);
  border-radius: 3px;
  -webkit-box-shadow: inset 0 0 5px rgb(37 37 37 / 5%);
}
.ant-menu-root {

}
.ant-menu .anticon {
  padding: 0px!important;
}
.ant-menu-inline-collapsed .anticon {
  width: 18px!important;
  height: 18px!important;
}
.ivz-sider-menu .ant-menu-inline-collapsed>.ant-menu-submenu>.ant-menu-submenu-title {
  padding: 0px 27px!important;
}
.ant-tooltip-inner {
  padding: 2px 10px;
  min-height: 22px;
  font-size: 12px;
}

/*动画*/
.list-enter-active {
  transition: all 0.3s;
}
.list-enter, .list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
