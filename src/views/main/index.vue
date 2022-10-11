<template>
  <a-layout style="width: 100%; height: 100%;" class="ant-layout-has-sider">
    <!--侧边菜单栏-->
    <LayoutSider />

    <a-layout class="ivz-layout-view">
      <!--右侧头-->
      <LayoutHeader />

      <!--右侧视图页-->
      <a-layout-content class="ivz-main-container">
        <router-view v-slot="{ Component }">
          <transition name="slide-fade" mode="out-in">
            <keep-alive :include="alive">
              <component :is="Component" />
            </keep-alive>
          </transition>
        </router-view>

        <!-- 用户中心 -->
        <UserCenter />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import {mapGetters, useStore} from "vuex";
import LayoutSider from "@msn/main/LayoutSider.vue";
import LayoutHeader from "@msn/main/LayoutHeader.vue";
import UserCenter from "@msn/main/UserCenter.vue";
import {initSysRoutesToMenus, resolverMenuToRoutes} from "@/router";

export default {
  name: "index",
  components:{UserCenter, LayoutSider, LayoutHeader},
  setup() {
    initSysRoutesToMenus(); // 挂载系统路由到菜单列表

    // 初始化后台菜单信息到路由
    useStore().dispatch('sys/initMenus').then(menus => {
      // 解析动态菜单到路由
      resolverMenuToRoutes(menus)
    })

    useStore().dispatch('sys/initUser')
  },
  computed: {
    ...mapGetters({
      taskBarData: 'sys/taskBarData',
    }),
    alive() {
      return this.taskBarData.map(menu => menu.url)
    }
  },
  methods: {

  }
}
</script>

<style>
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
.ivz-main-container {
  width: 100%;
  height: 100%;
  display: flex;
  display: -ms-flex;
  overflow: hidden;
  position: relative;
  background: #ffffff;
  flex-direction: column;
  display: -webkit-flex; /* Safari */
  justify-content: flex-start;
}
.ivz-main-container ::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.ivz-main-container ::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: hsl(0deg 0% 0% / 22%);
  -webkit-box-shadow: inset 0 0 5px hsl(0deg 0% 100% / 5%);
}

.ivz-main-container ::-webkit-scrollbar-track {
  border-radius: 3px;
  background: hsl(0deg 0% 83%);
  -webkit-box-shadow: inset 0 0 5px rgb(37 37 37 / 5%);
}
.ivz-ilv-user {
  /*height: 200px;*/
  overflow: hidden;
  position: relative;
  border: 1px solid #ebedf0;
  padding: 48px;
  background: #fafafa;
  width: 100%;
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

/*.ant-menu-root {*/

/*}*/
/*.ant-menu .anticon {*/
/*  padding: 0px!important;*/
/*}*/
/*.ant-menu-inline-collapsed .anticon {*/
/*  width: 18px!important;*/
/*  height: 18px!important;*/
/*}*/
/*.ivz-sider-menu .ant-menu-inline-collapsed>.ant-menu-submenu>.ant-menu-submenu-title {*/
/*  padding: 0px 27px!important;*/
/*}*/

/*动画*/
.slide-fade-enter-active {
  transition: all .5s ease-out;
}

.slide-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter-from,.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
