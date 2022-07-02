<template>
  <a-layout style="width: 100%; height: 100%">
    <!--侧边栏-->
    <a-layout-sider class="ivz-sider-menu" v-model:collapsed="collapsed" collapsible>
      <div class="logo">
        <a-avatar :size="48" :src="ivzStx + '/img/logo.png'"></a-avatar>
        <span style="vertical-align: sub; margin-left: 8px; font-size: 17px">厦门由创源</span>
      </div>
      <!--侧边菜单-->
      <a-menu @select="selectMenu" mode="inline" :inline-collapsed="collapsed"
              v-model:open-keys="openKeys" :theme="theme" @open-change="openChange"
              v-model:selected-keys="selectedKeys" v-model:collapsed="collapsed" collapsible>
        <template v-for="menu in menus">
          <a-menu-item v-if="!menu.children" :key="menu.url">
                            <span>
                                <ivz-icon :type="menu.icon"></ivz-icon>
                            </span>
            <span class="ivz-level-o">{{menu.name}}</span>
          </a-menu-item>
          <template v-else>
            <!--递归的子菜单-->
            <ivz-sub-menu :menu-info="menu" :key="menu.url"></ivz-sub-menu>
          </template>
        </template>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <!--右侧头-->
      <a-layout-header class="layout-header-bar" style="background: #fff; padding: 0">
        <div class="ivz-header-row">
          <!--头部菜单-->
          <div class="ivz-header-col iz-header-col-left">
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
                    <a-avatar :src="avatarUrl" :size="28" :load-error="loadError"></a-avatar>
                    <span style="font-size: 14px;"> 欢迎, {{user.name}}</span>
                  </div>
                  <!--                            <a-menu slot="overlay" @click="moreOpera">-->
                  <!--                                <a-menu-item key="info">-->
                  <!--                                    <ivz-icon type="iz-icon-user-info"></ivz-icon>-->
                  <!--                                    <span>个人信息</span>-->
                  <!--                                </a-menu-item>-->
                  <!--                                <a-menu-divider />-->
                  <!--                                <a-menu-item key="logout">-->
                  <!--                                    <ivz-icon type="iz-icon-logout"></ivz-icon>-->
                  <!--                                    <span>退出登录</span>-->
                  <!--                                </a-menu-item>-->
                  <!--                            </a-menu>-->
                </a-dropdown>
              </li>
              <li class="ivz-opera-col" @click="handleNotify">
                <!--                        <a-tooltip title="系统通知">-->
                <!--                            <div><ivz-icon type="iz-icon-notify" size="18px"></ivz-icon></div>-->
                <!--                        </a-tooltip>-->
              </li>
              <li style="clear: both"></li>
            </ul>
          </div>
          <div style="clear: both"></div>
        </div>
        <div class="ivz-task-bar">
          <a-tabs :active-key="activityMenu.url" @change="switchTask" :hide-add="true"
                  @edit="closeTask" type="editable-card" size="small">
            <a-tab-pane v-for="menu in taskBarData" :key="menu.url"
                        :closable="menu.closable != false">
              <template #tab>
                <ivz-icon :type="menu.icon" class="icon"></ivz-icon>
                <span style="margin-left: 5px">{{menu.name}}</span>
              </template>
            </a-tab-pane>
          </a-tabs>
          <div class="ivz-task-opera right">
            <a-dropdown placement="bottomLeft">
                                <span>
<!--                                  <ivz-icon type="iz-icon-more" size="18px"></ivz-icon>-->
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
      <a-layout-content class="iz-main-container">
        <div class="ivz-content-iframe">
          <transition-group name="list">
            <iframe v-for="menu in taskBarData" :key="menu.url" :id="menu.url"
                    :name="menu.name" :src="ivzCtx + menu.url"
                    frameBorder="false" v-show="menu==activityMenu" width="100%" height="100%">
            </iframe>
          </transition-group>
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
export default {
  name: "index",
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
      collapsed: true,
      theme: 'dark', // 主题 dark or light
      notifyVisible: false,
      fixedSider: false, // 固定侧边栏
      isCollapsed: false,
      activityMenu: {}, // 激活的菜单
      activityView: null,
      selectedKeys: [], // 当前选中的菜单
      workMenu: null,
      taskBarData: [], // 任务栏菜单列表
      expandMode: 'single', // 菜单展开模式 (single || multi)
    }
  },
  created() {
    this.$http.get("/resources").then(resp=>{
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
    },
    openChange(openKeys) {
      if (this.expandMode === 'single') { // 单选
        let lastKey = openKeys.find(key =>
            this.prevOpenKeys.indexOf(key) === -1) // 最后打开的菜单
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
      if(view.type == 'G' && this.isCollapsed) {
        this.collapsed();
      }

      this.activityView = view;
      this.menus = view['children'] || [];
    },
    handleNotify() {

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

<style scoped>

</style>
