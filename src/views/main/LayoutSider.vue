<template>
  <a-layout-sider class="ivz-sider-menu" width="208" :trigger="null"
      v-model:collapsed="collapsed" collapsible :collapsedWidth="72">
    <div class="logo" @click="collapsedHandle">
      <a-avatar :size="48" src="/img/logo.png"></a-avatar>
      <span class="ivz-ism-title" style="vertical-align: sub; margin-left: 8px; font-size: 17px">由创源科技</span>
    </div>
    <!--侧边菜单-->
    <div class="ivz-ism-menu">
      <a-menu @select="selectMenu" mode="inline"
              :openKeys="openKeys" :theme="theme"
              :selectedKeys="selectedKeys" @openChange="openChange">
        <template v-for="menu in menus">
          <template v-if="menu.type=='V'">
            <a-menu-item :key="menu.url">
              <ivz-icon :type="menu.icon"></ivz-icon>
              <span class="ivz-level-o">{{menu.name}}</span>
            </a-menu-item>
          </template>
          <template v-else-if="menu.type=='M'">
            <!--递归的子菜单-->
            <ivz-sub-menu :menu="menu"/>
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
      switchOpenSubMenuTo: 'sys/switchOpenSubMenuTo'
    }),
    selectMenu(menu) {
      this.$router.push(menu.key).finally()
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

<style>
.ivz-sider-menu .logo {
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
.ant-layout-sider-collapsed .ivz-ism-title {
  opacity: 0;
  max-width: 0px;
  display: inline-block;
  margin-left: 0px!important;
}
.ivz-ism-menu {
  flex: 1 1 0%;
  overflow: hidden auto;
}
.ivz-sider-menu .ant-layout-sider-children {
  height: 100%;
  display: flex;
  flex-direction: column;
}
/*侧边菜单栏滚动条样式*/
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
.ivz-sider-menu .ant-menu-inline-collapsed .anticon{
  font-size: 18px!important;
}
.ivz-sider-menu .ant-menu-inline-collapsed > .ant-menu-submenu > .ant-menu-submenu-title {
  padding: 0px 27px!important;
}
</style>
