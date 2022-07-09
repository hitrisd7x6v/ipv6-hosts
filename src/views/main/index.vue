<template>
  <a-layout style="width: 100%; height: 100%;" class="ant-layout-has-sider">
    <!--侧边栏-->
    <LayoutSider></LayoutSider>
    <a-layout>
      <!--右侧头-->
      <LayoutHeader></LayoutHeader>
      <a-layout-content class="iz-main-container">
        <router-view v-slot="{ Component }">
          <transition name="slide-fade" mode="out-in">
            <keep-alive :include="cacheViews">
              <component :is="Component" />
            </keep-alive>
          </transition>
        </router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import LayoutSider from "@msn/main/LayoutSider.vue";
import LayoutHeader from "@msn/main/LayoutHeader.vue";
import {mapGetters, useStore} from "vuex";
import {ref} from "vue";

export default {
  name: "main",
  components:{LayoutSider, LayoutHeader},
  setup() {
    let mounted = ref(false);
    useStore().dispatch('sys/initMenus')

    return {mounted}
  },
  computed: {
    ...mapGetters({
      taskBarData: 'sys/taskBarData',
    }),
    cacheViews() {
      return this.taskBarData.map(menu => menu.component)
    }
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
.iz-main-container {
  width: 100%;
  height: 100%;
  display: flex;
  display: -ms-flex;
  overflow: hidden;
  background: #ffffff;
  flex-direction: column;
  display: -webkit-flex; /* Safari */
  justify-content: flex-start;
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
  transition: all .6s ease-out;
}

.slide-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter-from,.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
