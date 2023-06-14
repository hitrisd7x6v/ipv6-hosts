<template>
  <a-layout-sider class="ivz-sider" :width="232" :trigger="null"
      v-model:collapsed="collapsed" collapsible :collapsedWidth="62">
    <div class="ivz-logo" @click="collapsedHandle">
      <div class="ivz-logo-c">
        <a-avatar :size="48" src="/img/logo.png"></a-avatar>
        <span class="ivz-ism-title" style="vertical-align: sub; margin-left: 8px; font-size: 17px">由创源科技</span>
      </div>
    </div>
    <!--侧边菜单-->
    <div class="ivz-sider-menu">
      <a-menu @select="selectMenu" mode="inline" :openKeys="openKeys"
              :selectedKeys="selectedKeys" @openChange="openChange">
        <template v-for="menu in menus">
          <template v-if="menu.type=='V'">
            <a-menu-item :key="menu.url">
              <UIcon :type="menu.icon || 'iz-icon-icon'" />
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
    let theme = ref('light')
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
      pushAndSwitchTask: 'sys/pushAndSwitchTask',
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
.ivz-logo {
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
.ivz-sider .ant-layout-sider-children {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.ivz-sider .ivz-sider-menu {
  flex-grow: 1;
  overflow: hidden auto;
}
/*侧边菜单栏滚动条样式*/
.ivz-sider .ant-layout-sider-collapsed .ant-menu-inline-collapsed {
  width: 72px;
}
.ivz-sider .ant-layout-sider-children ::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.ivz-sider-menu .ant-menu-inline-collapsed .anticon{
  font-size: 18px!important;
}
.ivz-sider-menu .ant-menu-inline-collapsed > .ant-menu-submenu > .ant-menu-submenu-title {
  padding: 0px 22px!important;
}
</style>
