<template>
  <a-layout-sider class="ivz-sider-menu" width="208" :trigger="null"
      v-model:collapsed="collapsed" collapsible :collapsedWidth="72">
    <div class="logo" @click="collapsedHandle">
      <a-avatar :size="48" src="/img/logo.png"></a-avatar>
      <span style="vertical-align: sub; margin-left: 8px; font-size: 17px">由创源科技</span>
    </div>
    <!--侧边菜单-->
    <div class="ivz-ism-menu">
      <a-menu @select="selectMenu" mode="inline"
              v-model:openKeys="openKeys" :theme="theme"
              v-model:selectedKeys="selectedKeys" @openChange="openChange">
        <template v-for="menu in menus" :key="menu.id">
          <template v-if="!menu.children">
            <a-menu-item :key="menu.url">
              <ivz-icon :type="menu.icon"></ivz-icon>
              <span class="ivz-level-o">{{menu.name}}</span>
            </a-menu-item>
          </template>
          <template v-else>
            <!--递归的子菜单-->
            <ivz-sub-menu :menu="menu" :key="menu.id"/>
          </template>
        </template>
      </a-menu>
    </div>
  </a-layout-sider>
</template>

<script>
import {ref} from "vue";
import IvzSubMenu from '@/views/main/SubMenu.vue'
import {mapGetters, mapMutations} from "vuex";

export default {
  name: "LayoutSider",
  setup() {
    // 主题 dark or light
    let theme = ref('dark')
    let collapsed = ref(false);
    return {collapsed, theme}
  },
  components: {IvzSubMenu},
  computed: {
    ...mapGetters({
      menus: 'sys/menus',
      openKeys: 'sys/openKeys',
      taskBarData: 'sys/taskBarData',
      selectedKeys: 'sys/selectedKeys',
    }),
  },
  methods: {
    ...mapMutations({
      openUrlOrSwitchTask: 'sys/openUrlOrSwitchTask',
      switchOpenSubMenuTo: 'sys/switchOpenSubMenuTo'
    }),
    selectMenu(menu) {
      this.openUrlOrSwitchTask(menu.key);
    },

    openChange(openKeys) {
      this.switchOpenSubMenuTo(openKeys);
    },

    collapsedHandle() {
      this.collapsed = !this.collapsed
    }
  }
}
</script>

<style scoped>
.logo {
  height: 68px;
  padding: 12px;
  color: #ffffff;
  cursor: pointer;
  overflow: hidden;
  text-align: center;
  white-space: nowrap;
  text-overflow:ellipsis;
  vertical-align: middle;
}
/*侧边栏*/
.ant-layout-sider {
  background: #001529;
}
.ivz-ism-menu {
  overflow: hidden auto;
  height: calc(100% - 68px);
}
.ivz-sider-menu .ant-layout-sider-children {
  height: 100%;
  display: flex;
  flex-direction: column;
}
/*侧边菜单栏滚动条样式*/
/*.ivz-sider-menu {*/
/*  overflow: hidden;*/
/*}*/
.ivz-sider-menu.ant-layout-sider-collapsed .ant-menu-inline-collapsed {
  width: 72px;
}
.ivz-ism-menu .ant-layout-sider-children ::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.ivz-ism-menu .ant-layout-sider-children ::-webkit-scrollbar-thumb {
  background: hsla(0,0%,100%,.2);
  border-radius: 3px;
  -webkit-box-shadow: inset 0 0 5px hsl(0deg 0% 100% / 5%);
}

.ivz-ism-menu .ant-layout-sider-children ::-webkit-scrollbar-track {
  background: hsla(0,0%,100%,.15);
  border-radius: 3px;
  -webkit-box-shadow: inset 0 0 5px rgb(37 37 37 / 5%);
}
</style>
